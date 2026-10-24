import React, { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, MessageSquareText, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── 3D folder ─────────────────────────────────────────────────────
 * A folder that tilts and opens in 3D, fanning its cards out above it.
 * Choosing a card grows it into a lightbox from where it sat (FLIP).
 *
 * Adapted from the supplied 3d-folder component:
 * - opens on hover AND on click / Enter / Space (touch and keyboard work);
 * - cards are real buttons, focusable only while the folder is open;
 * - the lightbox is a modal dialog: focus moves in, Tab is kept inside,
 *   Escape and the arrow keys work, focus returns to the card on close;
 * - the lightbox shows the item's category and offers "Cotizar producto"
 *   and "Ver productos" instead of the portfolio "View Project" button;
 * - reduced motion: no flight, no tilt, plain fades.
 * ─────────────────────────────────────────────────────────────────── */

export interface FolderItem {
  id: string;
  image: string;
  title: string;
  /** Small version for the fanned card; falls back to `image`. */
  thumb?: string;
}
/** Kept for compatibility with the original component's naming. */
export type Project = FolderItem;

export type FolderColors = { back: string; tab: string; front: string; ink: string };

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#262a30"/></svg>',
  );

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

const usePrefersReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

/* ── Card fanned out of the folder ─────────────────────────────── */

interface FolderCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
  /** Narrow screens: a tighter fan so cards stay near their folder. */
  compact: boolean;
}

const FolderCard = forwardRef<HTMLButtonElement, FolderCardProps>(
  ({ image, title, delay, isVisible, index, totalCount, onClick, isSelected, compact }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;

    const rotation = factor * 22;
    const translationX = factor * (compact ? 36 : 92);
    const translationY = Math.abs(factor) * 14;

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={!isVisible}
        aria-label={`Ampliar: ${title}`}
        className={cn(
          "group/card absolute -ml-[2.25rem] -mt-[3rem] h-[6rem] w-[4.5rem] cursor-zoom-in rounded-[3px] outline-none sm:-ml-[2.75rem] sm:-mt-[3.75rem] sm:h-[7.5rem] sm:w-[5.5rem]",
          "focus-visible:ring-4 focus-visible:ring-white",
          !isVisible && "pointer-events-none",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(${compact ? -92 : -118}px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : // At rest the first three photos peek out of the folder's mouth.
              `translateY(${compact ? -40 : -56}px) translateX(${factor * (compact ? 18 : 26)}px) rotate(${factor * 8}deg) scale(0.92)`,
          opacity: isSelected ? 0 : isVisible || index < 3 ? 1 : 0,
          transition: `transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 400ms ease ${delay}ms`,
          zIndex: 10 + index,
          left: 0,
          top: 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <span
          className={cn(
            "relative block h-full w-full overflow-hidden rounded-[3px] bg-graphite-3 outline-2 outline-solid outline-ink",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/card:-translate-y-5 group-hover/card:scale-[1.22] group-focus-visible/card:-translate-y-5 group-focus-visible/card:scale-[1.22]",
          )}
        >
          <img
            src={image || PLACEHOLDER_IMAGE}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
        </span>
      </button>
    );
  },
);
FolderCard.displayName = "FolderCard";

/* ── Lightbox ──────────────────────────────────────────────────── */

interface ImageLightboxProps {
  items: FolderItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  categoryLabel: string;
  onQuote?: (item: FolderItem) => void;
  onExplore?: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  categoryLabel,
  onQuote,
  onExplore,
}) => {
  const reduce = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const total = items.length;
  const hasNext = currentIndex < total - 1;
  const hasPrev = currentIndex > 0;
  const current = items[currentIndex];

  const navigateNext = useCallback(() => hasNext && onNavigate(currentIndex + 1), [hasNext, currentIndex, onNavigate]);
  const navigatePrev = useCallback(() => hasPrev && onNavigate(currentIndex - 1), [hasPrev, currentIndex, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    window.setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setPhase("initial");
      onCloseComplete?.();
    }, reduce ? 150 : 450);
  }, [onClose, onCloseComplete, reduce]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") navigateNext();
      else if (e.key === "ArrowLeft") navigatePrev();
      else if (e.key === "Tab" && dialogRef.current) {
        // Keep focus inside the dialog.
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    setShouldRender(true);
    setIsClosing(false);
    setPhase("initial");
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase("animating"));
    });
    const t = window.setTimeout(() => setPhase("complete"), reduce ? 60 : 650);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
  }, [isOpen, reduce]);

  useEffect(() => {
    if (phase === "complete" && isOpen) closeRef.current?.focus({ preventScroll: true });
  }, [phase, isOpen]);

  if (!shouldRender || !current) return null;

  const initialStyles = (): React.CSSProperties => {
    if (!sourceRect || reduce) return { transform: "scale(0.96)", opacity: 0 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = Math.min(896, vw - 32);
    const targetHeight = Math.min(vh * 0.85, 640);
    const scale = Math.max(sourceRect.width / targetWidth, sourceRect.height / targetHeight);
    // The overlay is fixed, so viewport coordinates are already right.
    const dx = sourceRect.left + sourceRect.width / 2 - vw / 2;
    const dy = sourceRect.top + sourceRect.height / 2 - vh / 2;
    return { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.5 };
  };
  const finalStyles: React.CSSProperties = { transform: "translate(0, 0) scale(1)", opacity: 1 };
  const styles = phase === "initial" && !isClosing ? initialStyles() : finalStyles;
  const shown = phase === "complete" && !isClosing;

  // Portalled to <body> so it sits above the fixed navigation.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      onClick={handleClose}
      style={{ opacity: isClosing ? 0 : 1, transition: "opacity 450ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className="absolute inset-0 bg-ink/95"
        style={{
          opacity: phase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <button
        ref={closeRef}
        type="button"
        aria-label="Cerrar"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute right-4 top-4 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-graphite-3 text-white transition-colors hover:bg-yellow hover:text-ink md:right-6 md:top-6"
        style={{ opacity: shown ? 1 : 0, transition: "opacity 300ms ease-out" }}
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={(e) => {
          e.stopPropagation();
          navigatePrev();
        }}
        disabled={!hasPrev}
        className="absolute left-2 z-[90] hidden h-14 w-14 items-center justify-center rounded-full bg-graphite-3 text-white transition-[transform,background-color] hover:scale-110 hover:bg-yellow hover:text-ink active:scale-95 disabled:opacity-0 sm:flex md:left-8"
        style={{ opacity: shown && hasPrev ? 1 : 0, transition: "opacity 300ms ease-out 120ms" }}
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={(e) => {
          e.stopPropagation();
          navigateNext();
        }}
        disabled={!hasNext}
        className="absolute right-2 z-[90] hidden h-14 w-14 items-center justify-center rounded-full bg-graphite-3 text-white transition-[transform,background-color] hover:scale-110 hover:bg-yellow hover:text-ink active:scale-95 disabled:opacity-0 sm:flex md:right-8"
        style={{ opacity: shown && hasNext ? 1 : 0, transition: "opacity 300ms ease-out 120ms" }}
      >
        <ChevronRight className="h-6 w-6" strokeWidth={3} />
      </button>

      <div
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...styles,
          transform: isClosing ? "translate(0, 0) scale(0.94)" : styles.transform,
          transition:
            phase === "initial" && !isClosing
              ? "none"
              : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div className="relative overflow-hidden rounded-[4px] bg-graphite shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]" /* taste-skill-ignore: dialog */>
          <div className="relative aspect-[4/3] overflow-hidden bg-graphite-2 md:aspect-[16/10]">
            <div
              className="flex h-full w-full"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: reduce ? "none" : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {items.map((item, idx) => (
                <div key={item.id} className="relative h-full min-w-full" aria-hidden={idx !== currentIndex}>
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={idx === currentIndex ? item.title : ""}
                    className="h-full w-full select-none object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[0.875rem] font-semibold text-white">
              Imagen de referencia
            </p>
          </div>

          <div
            className="flex flex-col gap-5 bg-graphite px-5 py-5 md:flex-row md:items-end md:justify-between md:px-8 md:py-7"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 400ms ease-out, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[1rem] font-semibold text-yellow">{categoryLabel}</p>
              <h3 id={titleId} className="mt-1 text-2xl font-[800] leading-tight text-white [font-stretch:108%] md:text-3xl">
                {current.title}
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5" role="group" aria-label="Elegir imagen">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Imagen ${idx + 1}: ${item.title}`}
                      aria-current={idx === currentIndex}
                      onClick={() => idx !== currentIndex && onNavigate(idx)}
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <span
                        className={cn(
                          "block h-2 rounded-full transition-[width,background-color] duration-300",
                          idx === currentIndex ? "w-6 bg-yellow" : "w-2 bg-steel/60 hover:bg-white",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <p className="tabular text-[0.875rem] font-semibold text-steel">
                  {currentIndex + 1} / {total}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {onExplore ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    window.setTimeout(onExplore, reduce ? 160 : 460);
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-[2px] bg-graphite-3 px-5 text-sm font-[750] uppercase text-white [font-stretch:112%] transition-colors hover:bg-[#33383f]"
                >
                  <Search className="h-4 w-4" />
                  Ver productos
                </button>
              ) : null}
              {onQuote ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    window.setTimeout(() => onQuote(current), reduce ? 160 : 460);
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-[2px] bg-yellow px-5 text-sm font-[750] uppercase text-ink [font-stretch:112%] transition-colors hover:bg-white"
                >
                  <MessageSquareText className="h-4 w-4" />
                  Cotizar producto
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ── Folder ────────────────────────────────────────────────────── */

interface AnimatedFolderProps {
  title: string;
  /** Short description under the title. */
  subtitle?: string;
  items: FolderItem[];
  className?: string;
  colors?: FolderColors;
  /** Shown in the lightbox as the item's category. */
  categoryLabel?: string;
  onQuote?: (item: FolderItem) => void;
  onExplore?: () => void;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({
  title,
  subtitle,
  items,
  className,
  colors,
  categoryLabel,
  onQuote,
  onExplore,
}) => {
  const reduce = usePrefersReducedMotion();
  const compact = useMedia("(max-width: 639px)");
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const isOpen = isHovered || isPinned || selectedIndex !== null;
  const preview = items.slice(0, 5);

  // Close a pinned folder when focus or a tap leaves it.
  useEffect(() => {
    if (!isPinned) return;
    const onDown = (e: PointerEvent) => {
      if (selectedIndex !== null) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsPinned(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [isPinned, selectedIndex]);

  const openItem = (item: FolderItem, index: number) => {
    const el = cardRefs.current[index];
    if (el) setSourceRect(el.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(item.id);
  };

  const c = colors ?? { back: "var(--folder-back)", tab: "var(--folder-tab)", front: "var(--folder-front)", ink: "#08090b" };
  const tilt = isOpen && !reduce;

  return (
    <>
      <div
        ref={rootRef}
        className={cn(
          "group relative flex flex-col items-center rounded-[4px] bg-graphite px-6 pb-7 pt-24",
          "transition-[background-color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen && "bg-graphite-3",
          className,
        )}
        style={{
          perspective: "1200px",
          transform: tilt ? "translateY(-4px) rotate(-1deg)" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onBlur={(e) => {
          if (selectedIndex === null && !e.currentTarget.contains(e.relatedTarget as Node)) setIsPinned(false);
        }}
      >
        {/* The folder itself */}
        <div className="relative h-[6.5rem] w-[9rem] sm:h-[9.5rem] sm:w-[13.5rem]" style={{ transformStyle: "preserve-3d" }}>
          {/* Back panel + tab */}
          <div
            className="absolute inset-0 rounded-[4px]"
            style={{
              background: c.back,
              transformOrigin: "bottom center",
              transform: tilt ? "rotateX(-6deg)" : "none",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <div
            className="absolute -top-4 left-0 h-6 w-[5.5rem] rounded-t-[4px]"
            style={{
              background: c.tab,
              transformOrigin: "bottom center",
              transform: tilt ? "rotateX(-6deg)" : "none",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Cards fan out from the folder's mouth */}
          <div id={panelId} className="absolute left-1/2 top-1/2 z-10" style={{ transform: "translate(0, 0)" }}>
            {preview.map((item, index) => (
              <FolderCard
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                image={item.thumb ?? item.image}
                title={item.title}
                delay={reduce ? 0 : index * 55}
                isVisible={isOpen}
                index={index}
                totalCount={preview.length}
                onClick={() => openItem(item, index)}
                isSelected={hiddenCardId === item.id}
                compact={compact}
              />
            ))}
          </div>

          {/* Front panel swings open */}
          <div
            className="absolute inset-x-0 bottom-0 top-3 z-20 flex items-end rounded-[4px] p-3"
            style={{
              background: c.front,
              transformOrigin: "bottom center",
              transform: tilt ? "rotateX(-40deg) translateY(2px)" : isOpen ? "translateY(18px)" : "none",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: isOpen ? "0 -12px 24px -14px rgba(0,0,0,0.6)" : "none",
            }}
          >
            <span
              aria-hidden
              className="text-[0.875rem] font-[800] uppercase leading-none tracking-[0.04em] [font-stretch:112%]"
              style={{ color: c.ink }}
            >
              {items.length} {items.length === 1 ? "foto" : "fotos"}
            </span>
          </div>
        </div>

        {/* Title and the control that opens it */}
        <div className="relative z-30 mt-8 flex w-full flex-1 flex-col items-center text-center">
          <h3 className="text-[1.125rem] font-[800] uppercase leading-tight text-white [font-stretch:110%]">{title}</h3>
          {subtitle ? (
            <p className="mx-auto mt-2 hidden max-w-[26ch] text-[1rem] leading-snug text-steel-soft sm:block">{subtitle}</p>
          ) : null}
          {/* Minimum gap above the bottom-anchored action. */}
          <span className="block h-4 shrink-0" aria-hidden />
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsPinned((p) => !p)}
            className={cn(
              "mt-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-[2px] px-4 text-[0.875rem] font-[750] uppercase [font-stretch:112%]",
              "transition-colors",
              isOpen ? "bg-yellow text-ink" : "bg-ink text-white hover:bg-yellow hover:text-ink",
            )}
          >
            {/* One text box, so the flex gap doesn't widen the word spaces. */}
            <span>
              {isOpen ? (
                <>
                  Elige<span className="hidden sm:inline"> una</span> foto
                </>
              ) : (
                <>
                  Abrir<span className="hidden sm:inline"> carpeta</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      <ImageLightbox
        items={items}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={() => {
          setSelectedIndex(null);
          setSourceRect(null);
        }}
        sourceRect={sourceRect}
        onCloseComplete={() => {
          const idx = items.findIndex((i) => i.id === hiddenCardId);
          setHiddenCardId(null);
          const el = cardRefs.current[Math.min(Math.max(idx, 0), preview.length - 1)];
          el?.focus({ preventScroll: true });
        }}
        onNavigate={(i) => {
          setSelectedIndex(i);
          setHiddenCardId(items[i]?.id ?? null);
        }}
        categoryLabel={categoryLabel ?? title}
        onQuote={onQuote}
        onExplore={onExplore}
      />
    </>
  );
};

export default AnimatedFolder;
