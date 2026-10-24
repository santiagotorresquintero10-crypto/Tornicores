import * as React from "react";

/**
 * Subtle magnetic pull toward the cursor for primary actions.
 * Only on fine pointers and without reduced motion; max shift 6px.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.18, max = 6) {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => (el.style.translate = `${dx}px ${dy}px`));
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.translate = "0px 0px";
    };
    el.style.transition = "translate 350ms cubic-bezier(0.16,1,0.3,1), background-color 200ms, color 200ms";
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, max]);
  return ref;
}
