import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageSquareText, X } from "lucide-react";
import logo from "@/assets/brand/logo-torniracores-520.webp";
import { BUSINESS } from "@/config/business";
import { cn, scrollToId } from "@/lib/utils";
import { useSiteActions } from "@/context/site-actions";

export const NAV_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "categorias", label: "Categorías" },
  { id: "productos", label: "Productos" },
  { id: "marcas", label: "Marcas" },
  { id: "nosotros", label: "Nosotros" },
  { id: "cotizar", label: "Contacto" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("inicio");
  const { requestQuote } = useSiteActions();
  const menuBtn = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view.
  React.useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock scroll, Escape closes, focus moves in and back.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the panel itself so screen readers enter it without a ring on the first link.
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 220 : 0);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <a
        href="#contenido"
        className="sr-only-focusable fixed left-4 top-4 z-[100] bg-yellow px-4 py-3 font-bold text-ink"
      >
        Saltar al contenido
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500",
          scrolled || open ? "bg-ink/88 backdrop-blur-md" : "bg-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <nav className="frame frame-max flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Principal">
          <a href="#inicio" onClick={go("inicio")} className="shrink-0" aria-label={`${BUSINESS.name}, ir al inicio`}>
            <img src={logo} alt={`${BUSINESS.name}, ${BUSINESS.tagline}`} width={520} height={120} className="h-9 w-auto md:h-10" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={cn(
                    "relative px-3 py-2 text-[1rem] font-semibold transition-colors",
                    active === l.id ? "text-white" : "text-steel-soft hover:text-white",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[3px] origin-left bg-yellow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active === l.id ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => requestQuote()}
              className="hidden h-11 items-center gap-2 rounded-[2px] bg-yellow px-5 text-[0.875rem] font-[800] uppercase text-ink [font-stretch:115%] transition-colors hover:bg-white sm:inline-flex"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden />
              Cotizar ahora
            </button>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-[2px] bg-graphite-3 text-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-movil"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            tabIndex={-1}
            className="fixed inset-0 z-40 flex flex-col bg-ink outline-none pt-[calc(var(--nav-h)+env(safe-area-inset-top,0px))] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="frame flex flex-1 flex-col justify-center gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className={cn(
                      "display block py-2 text-[clamp(2.25rem,11vw,3.5rem)]",
                      active === l.id ? "text-yellow" : "text-white",
                    )}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="frame pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => requestQuote(), 220);
                }}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[2px] bg-yellow text-[1rem] font-[800] uppercase text-ink [font-stretch:115%]"
              >
                <MessageSquareText className="h-5 w-5" aria-hidden />
                Cotizar ahora
              </button>
              <p className="mt-4 text-center text-[1rem] text-steel-soft">
                WhatsApp {BUSINESS.whatsappDisplay}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
