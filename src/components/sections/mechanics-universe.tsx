import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";
import { categoryById } from "@/data/categories";
import { CAR_SYSTEMS, SYSTEMS, type SystemId, type VehicleKind, type VehicleSystem } from "@/data/systems";
import { useSiteActions } from "@/context/site-actions";
import { cn } from "@/lib/utils";

const W = 1000;
const H = 440;

/**
 * Side view of a two-axle truck, cab to the right, drawn flat. Each system
 * owns the lines that light up when it is chosen.
 */
function TruckDrawing({ active }: { active: SystemId }) {
  const on = (id: SystemId) => active === id;
  const line = (id: SystemId) => (on(id) ? "#ffb900" : "#3a3f47");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      <defs>
        <style>{`
          @keyframes flow { to { stroke-dashoffset: -40; } }
          .flow { animation: flow 1.2s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
        `}</style>
      </defs>
      {/* Ground */}
      <rect x="40" y="399" width={W - 80} height="6" fill="#262a30" />
      {/* Cargo body */}
      <rect x="96" y="70" width="600" height="172" fill="#1f2227" />
      {/* Cab */}
      <path d="M716 252 V112 Q716 92 736 92 H862 Q884 92 896 112 L940 190 Q950 206 950 226 V252 Z" fill="#262a30" />
      <path d="M738 112 H852 Q866 112 874 126 L908 186 H738 Z" fill="#15171a" />
      {/* Engine (cut-away) and gearbox */}
      <rect x="760" y="206" width="132" height="46" fill="#33383f" />
      <rect x="690" y="232" width="62" height="28" fill={on("transmision") ? "#ffb900" : "#33383f"} />
      {/* Frame rail */}
      <rect x="96" y="252" width="864" height="18" fill="#3a3f47" />
      {/* Air tanks */}
      <rect x="470" y="288" width="104" height="26" rx="13" fill={on("frenos") ? "#ffb900" : "#33383f"} />
      {/* Muffler and exhaust */}
      <path d="M800 252 V282 H640" fill="none" stroke={line("transmision")} strokeWidth="8" strokeLinecap="round" />
      <rect x="560" y="286" width="80" height="28" rx="6" fill={on("transmision") ? "#ffb900" : "#33383f"} />
      <path d="M560 300 H430" fill="none" stroke={line("transmision")} strokeWidth="8" strokeLinecap="round" />

      {/* Leaf springs + shocks at both axles */}
      {[262, 782].map((x) => (
        <g key={x}>
          <path d={`M${x - 64} 280 Q${x} 304 ${x + 64} 280`} fill="none" stroke={line("suspension")} strokeWidth="9" strokeLinecap="round" />
          <path d={`M${x - 56} 290 Q${x} 310 ${x + 56} 290`} fill="none" stroke={line("suspension")} strokeWidth="6" strokeLinecap="round" />
          <path d={`M${x + 44} 270 L${x + 52} 330`} stroke={line("suspension")} strokeWidth="10" strokeLinecap="round" />
        </g>
      ))}

      {/* Wheels */}
      {[262, 782].map((x) => (
        <g key={x}>
          <circle cx={x} cy="352" r="48" fill="#0d0e10" />
          <circle cx={x} cy="352" r="28" fill={on("tornilleria") ? "#ffb900" : "#5d636b"} />
          <circle cx={x} cy="352" r="10" fill="#9ca3af" />
        </g>
      ))}

      {/* Air brake lines: compressor → tanks → foot valve; tanks → relay → rear; foot → front */}
      <g fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path
          className={on("frenos") ? "flow" : undefined}
          strokeDasharray={on("frenos") ? "14 6" : undefined}
          stroke={line("frenos")}
          d="M812 236 V274 H574 M470 300 H330 V262 M330 274 V318 H238 V330 M574 300 H600 V200 H872 M872 200 V240 H760 V330"
        />
      </g>
      {/* Power steering: pump → box */}
      <g fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path
          className={on("direccion") ? "flow" : undefined}
          strokeDasharray={on("direccion") ? "14 6" : undefined}
          stroke={line("direccion")}
          d="M780 226 Q800 262 846 262 H890 V252"
        />
      </g>
      <rect x="878" y="238" width="30" height="28" fill={on("direccion") ? "#ffb900" : "#33383f"} />
    </svg>
  );
}

/**
 * Side view of a front-engine car, nose to the right, with the engine bay
 * cut away. Same colour logic as the truck.
 */
function CarDrawing({ active }: { active: SystemId }) {
  const on = (id: SystemId) => active === id;
  const line = (id: SystemId) => (on(id) ? "#ffb900" : "#3a3f47");
  const flow = (id: SystemId) => (on(id) ? { className: "flow", strokeDasharray: "14 6" } : {});
  const coil = (x: number, top: number) =>
    `M${x} ${top} l14 6 l-28 8 l28 8 l-28 8 l28 8 l-14 6`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      <defs>
        <style>{`
          @keyframes flow { to { stroke-dashoffset: -40; } }
          .flow { animation: flow 1.2s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
        `}</style>
      </defs>
      <rect x="40" y="399" width={W - 80} height="6" fill="#262a30" />
      {/* Body */}
      <path
        d="M92 334 V276 Q96 244 140 236 L300 228 Q362 150 436 142 L600 140 Q652 142 694 204 L884 224 Q944 232 950 274 V334 Z"
        fill="#262a30"
      />
      <path d="M330 222 Q382 164 442 158 L592 156 Q630 160 660 206 Z" fill="#15171a" />
      <rect x="494" y="156" width="10" height="66" fill="#262a30" />
      {/* Wheel arches */}
      {[250, 760].map((x) => (
        <circle key={x} cx={x} cy="352" r="62" fill="#0b0c0e" />
      ))}
      {/* Engine (cut-away) and gearbox */}
      <rect x="760" y="228" width="128" height="60" fill="#33383f" />
      <rect x="664" y="254" width="58" height="26" fill={on("transmision") ? "#ffb900" : "#33383f"} />
      {/* Exhaust and muffler */}
      <path d="M800 288 V336 H210" fill="none" stroke={line("transmision")} strokeWidth="7" strokeLinecap="round" />
      <rect x="120" y="306" width="84" height="26" rx="6" fill={on("transmision") ? "#ffb900" : "#33383f"} />

      {/* Suspension: struts with coil springs, lower arm at the front */}
      {[
        { x: 760, top: 238 },
        { x: 250, top: 248 },
      ].map(({ x, top }) => (
        <g key={x} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${x + 6} ${top} L${x} 330`} stroke={line("suspension")} strokeWidth="9" />
          <path d={coil(x - 18, top + 32)} stroke={line("suspension")} strokeWidth="5" />
        </g>
      ))}
      <path d="M700 352 H758" stroke={line("suspension")} strokeWidth="8" strokeLinecap="round" />

      {/* Wheels with discs */}
      {[250, 760].map((x) => (
        <g key={x}>
          <circle cx={x} cy="352" r="48" fill="#0d0e10" />
          <circle cx={x} cy="352" r="30" fill={on("frenos") ? "#ffb900" : "#5d636b"} />
          <circle cx={x} cy="352" r="12" fill={on("tornilleria") ? "#ffb900" : "#9ca3af"} />
        </g>
      ))}

      {/* Hydraulic brake lines: master cylinder → front and rear wheels */}
      <rect x="652" y="200" width="34" height="20" fill={on("frenos") ? "#ffb900" : "#33383f"} />
      <path
        {...flow("frenos")}
        fill="none"
        stroke={line("frenos")}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M668 220 V318 H790 V322 M668 318 H280 V322"
      />

      {/* Power steering: pump → hoses → rack */}
      <rect x="830" y="226" width="26" height="22" fill={on("direccion") ? "#ffb900" : "#33383f"} />
      <path
        {...flow("direccion")}
        fill="none"
        stroke={line("direccion")}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M842 248 Q836 286 806 286 H730 V310"
      />
      <rect x="700" y="310" width="60" height="12" fill={on("direccion") ? "#ffb900" : "#33383f"} />
    </svg>
  );
}

const VEHICLES: { id: VehicleKind; label: string; systems: VehicleSystem[]; caption: string }[] = [
  { id: "camion", label: "Camión", systems: SYSTEMS, caption: "Diagrama simplificado de un camión de dos ejes, con fines educativos." },
  { id: "auto", label: "Automóvil", systems: CAR_SYSTEMS, caption: "Diagrama simplificado de un automóvil de motor delantero, con fines educativos." },
];

export function MechanicsUniverse() {
  const { explore } = useSiteActions();
  const [vehicle, setVehicle] = React.useState<VehicleKind>("camion");
  const v = VEHICLES.find((x) => x.id === vehicle)!;
  const SYS = v.systems;
  const [systemId, setSystemId] = React.useState<SystemId>("frenos");
  const system = SYS.find((s) => s.id === systemId) ?? SYS[0];
  const [partId, setPartId] = React.useState(system.parts[0].id);
  const part = system.parts.find((p) => p.id === partId) ?? system.parts[0];
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const selectSystem = (id: SystemId, list = SYS) => {
    setSystemId(id);
    setPartId(list.find((s) => s.id === id)!.parts[0].id);
  };

  const selectVehicle = (id: VehicleKind) => {
    setVehicle(id);
    const list = VEHICLES.find((x) => x.id === id)!.systems;
    selectSystem(systemId, list);
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = SYS.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      selectSystem(SYS[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section id="sistemas" aria-labelledby="sistemas-title" className="bg-graphite-2 py-24 md:py-32">
      <div className="frame frame-max">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem className="lg:col-span-8">
            <h2 id="sistemas-title" className="display h2">
              Cada pieza tiene una función.
            </h2>
          </RevealItem>
          <RevealItem className="lg:col-span-4">
            <p className="text-[1.125rem] font-semibold leading-[1.4] text-white">Juntas hacen posible el movimiento.</p>
            <p className="mt-2 text-[1.0625rem] leading-[1.55] text-steel-soft">
              Elige el vehículo y un sistema, y toca sus componentes para ver qué hace cada uno.
            </p>
          </RevealItem>
        </Reveal>

        {/* Vehicle switch */}
        <div className="mt-12 inline-flex bg-ink p-1" role="group" aria-label="Tipo de vehículo">
          {VEHICLES.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={vehicle === x.id}
              onClick={() => selectVehicle(x.id)}
              className={cn(
                "h-11 rounded-[2px] px-5 text-[0.875rem] font-[800] uppercase [font-stretch:112%] transition-colors",
                vehicle === x.id ? "bg-white text-ink" : "text-steel-soft hover:text-white",
              )}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div role="tablist" aria-label="Sistemas del vehículo" className="mt-4 flex flex-wrap gap-2">
          {SYS.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={s.id === systemId}
              aria-controls="panel-sistema"
              tabIndex={s.id === systemId ? 0 : -1}
              onClick={() => selectSystem(s.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "h-12 shrink-0 rounded-[2px] px-4 text-[0.875rem] font-[750] uppercase [font-stretch:110%] transition-colors",
                s.id === systemId ? "bg-yellow text-ink" : "bg-graphite-3 text-white hover:bg-[#33383f]",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div id="panel-sistema" role="tabpanel" aria-labelledby={`tab-${systemId}`} className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Diagram with hotspots */}
          <div className="relative bg-ink p-3 sm:p-6 lg:col-span-8">
            <p className="mb-2 max-w-[60ch] text-[1.0625rem] leading-snug text-steel-soft">{system.lead}</p>
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={vehicle}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {vehicle === "camion" ? <TruckDrawing active={systemId} /> : <CarDrawing active={systemId} />}
                </motion.div>
              </AnimatePresence>
              {system.parts.flatMap((p) =>
                p.at.map((pt, k) => (
                  <button
                    key={`${p.id}-${k}`}
                    type="button"
                    onClick={() => setPartId(p.id)}
                    aria-label={p.name}
                    aria-pressed={p.id === part.id}
                    tabIndex={k === 0 ? 0 : -1}
                    className="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-11 sm:w-11"
                    style={{ left: `${(pt.x / W) * 100}%`, top: `${(pt.y / H) * 100}%` }}
                  >
                    <span
                      className={cn(
                        "absolute h-full w-full rounded-full bg-yellow/30 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        p.id === part.id ? "scale-100 opacity-100" : "scale-75 opacity-0",
                      )}
                    />
                    <span
                      className={cn(
                        "relative block rounded-full transition-[width,height,background-color] duration-300",
                        p.id === part.id
                          ? "h-5 w-5 bg-yellow ring-4 ring-ink"
                          : "h-3.5 w-3.5 bg-white ring-4 ring-ink group-hover:h-4.5 group-hover:w-4.5 group-hover:bg-yellow",
                      )}
                    />
                  </button>
                )),
              )}
            </div>
            <p className="mt-2 text-[0.875rem] text-steel">{v.caption}</p>
          </div>

          {/* Parts list and the selected part */}
          <div className="flex flex-col gap-2 lg:col-span-4">
            <ul className="flex flex-col gap-1.5" aria-label={`Componentes de ${system.name}`}>
              {system.parts.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={p.id === part.id}
                    onClick={() => setPartId(p.id)}
                    className={cn(
                      "flex h-12 w-full items-center justify-between px-4 text-left text-[1.0625rem] font-semibold transition-colors",
                      p.id === part.id ? "bg-white text-ink" : "bg-graphite text-white hover:bg-graphite-3",
                    )}
                  >
                    {p.name}
                    <span className={cn("h-2.5 w-2.5 rounded-full", p.id === part.id ? "bg-yellow" : "bg-graphite-3")} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              <motion.div
                key={part.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 flex flex-1 flex-col bg-yellow p-6 text-ink"
                aria-live="polite"
              >
                <h3 className="text-[1.625rem] font-[850] uppercase leading-[1] [font-stretch:105%]">{part.name}</h3>
                <p className="mt-3 text-[1.0625rem] leading-[1.5]">{part.text}</p>
                <p className="mt-4 text-[1rem] font-semibold">Categoría: {categoryById(part.category).name}</p>
                <Button
                  variant="ink"
                  className="mt-6 self-start"
                  onClick={() => explore({ category: part.category, query: "" })}
                >
                  Explorar productos
                  <ArrowRight className="group-hover/btn:translate-x-1" aria-hidden />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
