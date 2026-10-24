import * as React from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, MessageSquareText } from "lucide-react";
import { Spotlight, InteractiveSpotlight } from "@/components/ui/spotlight";
import { MechanicalStage } from "@/components/three/mechanical-stage";
import { useSiteActions } from "@/context/site-actions";
import { useMagnetic } from "@/hooks/use-magnetic";
import { buttonVariants } from "@/components/ui/button";
import { cn, scrollToId } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const progress = React.useRef(0);
  const { requestQuote } = useSiteActions();
  const primary = useMagnetic<HTMLButtonElement>();
  const secondary = useMagnetic<HTMLButtonElement>();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));
  // Light parallax: copy drifts up slower than the page, the stage a touch faster.
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink pt-[calc(var(--nav-h)+env(safe-area-inset-top,0px))]"
    >
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-[28%]" fill="#FFB900" />
      <InteractiveSpotlight size={520} className="from-yellow/25 via-yellow/8 to-transparent blur-3xl" />

      <div className="frame frame-max relative grid min-h-[calc(100svh-var(--nav-h))] grid-cols-1 items-center gap-y-6 pb-10 lg:grid-cols-12 lg:pb-16">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 pt-8 lg:col-span-7 lg:pt-0">
          <h1 id="hero-title" className="display text-[clamp(1.9rem,8.1vw,5.9rem)] [font-stretch:90%] sm:text-[6.7vw] sm:[font-stretch:100%] lg:text-[clamp(3rem,4.55vw,5.6rem)]">
            {["La fuerza detrás", "de cada movimiento."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.09, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-[38ch] text-[clamp(1.125rem,1.05rem+0.45vw,1.4rem)] leading-[1.45] text-steel-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
          >
            Repuestos, tornillería y soluciones automotrices para mantener tu mundo en marcha.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease }}
          >
            <button
              ref={primary}
              type="button"
              onClick={() => scrollToId("productos")}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              Explorar productos
              <ArrowRight className="group-hover/btn:translate-x-1" aria-hidden />
            </button>
            <button
              ref={secondary}
              type="button"
              onClick={() => requestQuote()}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              <MessageSquareText aria-hidden />
              Solicitar cotización
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: stageY }}
          className="relative h-[min(56svh,30rem)] w-full sm:h-[34rem] lg:col-span-5 lg:-ml-[10%] lg:h-[min(80svh,48rem)] lg:w-[calc(110%+var(--gutter))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <MechanicalStage scrollRef={progress} />
        </motion.div>
      </div>

      <a
        href="#categorias"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("categorias");
        }}
        className="frame frame-max absolute inset-x-0 bottom-5 z-10 hidden items-center gap-3 text-[0.875rem] font-semibold text-steel transition-colors hover:text-white lg:flex"
      >
        <span className="relative block h-10 w-[3px] overflow-hidden bg-graphite-3" aria-hidden>
          <span className="absolute inset-x-0 top-0 h-1/3 bg-yellow motion-safe:animate-[scroll-cue_1.8s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
        </span>
        Desliza para ver las categorías
        <ArrowDown className="h-4 w-4" aria-hidden />
      </a>
    </section>
  );
}
