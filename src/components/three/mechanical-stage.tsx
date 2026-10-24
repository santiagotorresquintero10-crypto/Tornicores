import * as React from "react";
import { Hand } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { SplineScene } from "@/components/ui/splite";
import { cn } from "@/lib/utils";
import type { SceneHandle } from "./mechanical-scene";

type Mode = "pending" | "webgl" | "spline" | "static";

function isLowPower() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  );
}

/**
 * Right-hand side of the hero.
 * - A Spline scene when the business configures one it owns (BUSINESS.splineScene).
 * - Otherwise the built-in WebGL brake assembly, loaded after first paint.
 * - Without WebGL, or with data saving on: a static technical drawing,
 *   labelled as such, instead of pretending to be interactive.
 */
export function MechanicalStage({ scrollRef, className }: { scrollRef: React.RefObject<number>; className?: string }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const handleRef = React.useRef<SceneHandle | null>(null);
  const [mode, setMode] = React.useState<Mode>("pending");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (BUSINESS.splineScene) {
      setMode("spline");
      return;
    }
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) {
      setMode("static");
      return;
    }
    let cancelled = false;
    import("./mechanical-scene")
      .then(({ createMechanicalScene, canUseWebGL }) => {
        if (cancelled || !canvasRef.current || !wrapRef.current) return;
        if (!canUseWebGL()) {
          setMode("static");
          return;
        }
        setMode("webgl");
        try {
          handleRef.current = createMechanicalScene(canvasRef.current, wrapRef.current, {
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            lowPower: isLowPower(),
            onReady: () => setReady(true),
          });
        } catch {
          setMode("static");
        }
      })
      .catch(() => !cancelled && setMode("static"));
    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  // Feed hero scroll progress into the scene each frame it changes.
  React.useEffect(() => {
    let raf = 0;
    let lastP = -1;
    const tick = () => {
      const p = scrollRef.current ?? 0;
      if (p !== lastP) {
        handleRef.current?.setScroll(p);
        lastP = p;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRef]);

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full", className)}>
      {mode === "spline" && BUSINESS.splineScene ? (
        <SplineScene scene={BUSINESS.splineScene} className="h-full w-full" onLoad={() => setReady(true)} />
      ) : null}

      <canvas
        ref={canvasRef}
        aria-label="Conjunto de freno de disco en 3D: disco ventilado, mordaza, pernos y tuercas. Arrastra para girarlo."
        role="img"
        className={cn(
          "absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-1000",
          mode === "webgl" && ready ? "opacity-100" : "opacity-0",
          mode !== "webgl" && mode !== "pending" && "hidden",
        )}
      />

      {mode === "pending" || (mode === "webgl" && !ready) ? (
        <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Cargando escena 3D">
          <span className="loader" />
        </div>
      ) : null}

      {mode === "static" ? <StaticRotor /> : null}

      {mode === "webgl" && ready ? (
        <p className="pointer-events-none absolute bottom-3 right-0 flex lg:right-[var(--gutter)] items-center gap-2 text-[0.875rem] font-medium text-steel md:bottom-8">
          <Hand className="h-4 w-4 text-yellow" aria-hidden />
          Arrastra para girar · desplázate para desarmar
        </p>
      ) : null}
    </div>
  );
}

/** Flat technical drawing of the same assembly, for devices without WebGL. */
function StaticRotor() {
  const holes = Array.from({ length: 10 }, (_, i) => i).flatMap((i) => {
    const a = (i / 10) * Math.PI * 2;
    return [
      [113, 0],
      [129, 0.085],
      [145, 0.17],
    ].map(([r, o]) => ({ x: 200 + Math.cos(a + o) * r, y: 200 + Math.sin(a + o) * r }));
  });
  const studs = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: 200 + Math.cos(a) * 62, y: 200 + Math.sin(a) * 62 };
  });
  return (
    <figure className="flex h-full w-full flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 400 400" className="h-auto w-[min(88%,30rem)]" role="img" aria-label="Dibujo de un disco de freno perforado con su mordaza">
        <circle cx="200" cy="200" r="160" fill="#9aa1aa" />
        {holes.map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r="4.5" fill="#08090b" />
        ))}
        <circle cx="200" cy="200" r="98" fill="#5d636b" />
        <circle cx="200" cy="200" r="34" fill="#08090b" />
        <circle cx="200" cy="200" r="24" fill="#c4c9d0" />
        {studs.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r="11" fill="#d9dde2" />
        ))}
        <path d="M 306 40 A 182 182 0 0 1 378 168 L 306 183 A 108 108 0 0 0 266 108 Z" fill="#ffb900" />
      </svg>
      <figcaption className="text-[0.875rem] text-steel">Vista estática del conjunto de freno</figcaption>
    </figure>
  );
}
