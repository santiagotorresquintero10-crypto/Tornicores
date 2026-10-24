import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, MessageSquareText } from "lucide-react";
import facade960 from "@/assets/brand/fachada-960.webp";
import facade1444 from "@/assets/brand/fachada-1444.webp";
import { BUSINESS, mapsLink } from "@/config/business";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { buttonVariants } from "@/components/ui/button";
import { useSiteActions } from "@/context/site-actions";
import { cn } from "@/lib/utils";

/** Families painted on the façade's pillars, as they read in the photograph. */
const PAINTED = ["Herramientas", "Retenedores", "Suspensión", "Kit de clutch", "Pernos", "Tornillería", "Mofles"];

export function Headquarters() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { requestQuote } = useSiteActions();
  const maps = mapsLink();

  // The photograph opens from a band to the full frame, then drifts gently.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.38], ["inset(14% 9% 14% 9%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="bg-ink pt-24 md:pt-32">
      <div className="frame frame-max">
        {/* The brief's two-sentence headline: the claim as the h2, its second
            sentence directly beneath at statement size (a single 50-character
            h2 would run past two lines on phones). */}
        <Reveal>
          <RevealItem>
            <h2 id="nosotros-title" className="display h2">
              Una empresa real.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-3 text-[1.125rem] font-[700] uppercase leading-[1.15] text-steel-soft md:text-[2.25rem] md:font-[800] md:leading-[1.05] md:text-white">
              Soluciones que mueven tu camino.
            </p>
          </RevealItem>
        </Reveal>
      </div>

      <div ref={ref} className="relative mt-12 md:mt-16">
        <motion.div style={{ clipPath: clip }} className="relative h-[68svh] min-h-[26rem] overflow-hidden md:h-[88svh]">
          <motion.img
            src={facade1444}
            srcSet={`${facade960} 960w, ${facade1444} 1444w`}
            sizes="100vw"
            alt="Fachada de la sede de TORNIRACORES 2: edificio esquinero en amarillo y negro con el logotipo y las familias de producto pintadas en sus columnas."
            loading="lazy"
            decoding="async"
            width={1444}
            height={1089}
            style={{ scale, y }}
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
          />
        </motion.div>

        {/* Information plate, overlapping the bottom of the photograph */}
        <div className="frame frame-max relative -mt-24 md:-mt-40">
          <Reveal className="grid md:grid-cols-12">
            <RevealItem className="bg-yellow p-6 text-ink sm:p-8 md:col-span-7 md:p-10 lg:col-span-6">
              <p className="text-[1.625rem] font-[850] uppercase italic leading-none [font-stretch:115%]">{BUSINESS.name}</p>
              <p className="mt-1 text-[1.0625rem] font-semibold">{BUSINESS.tagline}</p>

              <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.55]">
                Una esquina en amarillo y negro que se reconoce desde la calle. En sus columnas se leen las familias que
                atendemos todos los días:
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {PAINTED.map((p) => (
                  <li key={p} className="bg-ink px-2.5 py-1.5 text-[0.875rem] font-[750] uppercase text-white [font-stretch:105%]">
                    {p}
                  </li>
                ))}
              </ul>

              <dl className="mt-7 grid gap-3 text-[1.0625rem] sm:grid-cols-2">
                <div>
                  <dt className="font-bold">WhatsApp</dt>
                  <dd>
                    <a className="underline decoration-2 underline-offset-4 hover:no-underline" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer">
                      {BUSINESS.whatsappDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">Correo</dt>
                  <dd>
                    <a className="break-all underline decoration-2 underline-offset-4 hover:no-underline" href={`mailto:${BUSINESS.email}`}>
                      {BUSINESS.email}
                    </a>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-bold">Dirección</dt>
                  <dd>{BUSINESS.address ?? "Escríbenos y te indicamos cómo llegar."}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                {maps ? (
                  <a href={maps} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ink", size: "lg" }))}>
                    <MapPin aria-hidden />
                    Cómo llegar
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hola ${BUSINESS.name}, ¿me comparten la dirección de la sede?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "ink", size: "lg" }))}
                  >
                    <MapPin aria-hidden />
                    Cómo llegar
                  </a>
                )}
                <button type="button" onClick={() => requestQuote()} className={cn(buttonVariants({ variant: "light", size: "lg" }))}>
                  <MessageSquareText aria-hidden />
                  Contactar
                </button>
              </div>
              {!maps ? (
                <p className="mt-3 text-[0.875rem]">
                  Mientras publicamos el mapa, “Cómo llegar” te abre WhatsApp para pedir la dirección.
                </p>
              ) : null}
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
