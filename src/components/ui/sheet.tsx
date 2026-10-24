import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Hide the visible title (still announced). */
  hideTitle?: boolean;
  children: React.ReactNode;
  className?: string;
};

/**
 * Side sheet on desktop, bottom sheet on phones. Modal: focus moves in, Tab
 * stays inside, Escape or the backdrop closes, focus returns on close.
 */
export function Sheet({ open, onClose, title, hideTitle, children, className }: SheetProps) {
  const panel = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  React.useEffect(() => {
    if (!open) return;
    const onClose = () => closeRef.current();
    const returnTo = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus],button,a[href]")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
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
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnTo?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto overscroll-contain bg-graphite",
              "md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[min(34rem,100vw)]",
              "shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.7)]", // taste-skill-ignore: dialog
              className,
            )}
            initial={{ y: "8%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "6%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-graphite px-5 py-4 md:px-7">
              <h2 id={titleId} className={cn("text-lg font-[800] uppercase [font-stretch:110%]", hideTitle && "sr-only")}>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-graphite-3 text-white transition-colors hover:bg-yellow hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
