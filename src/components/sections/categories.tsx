import { motion } from "framer-motion";
import { AnimatedFolder } from "@/components/ui/3d-folder";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { CATEGORIES } from "@/data/categories";
import { photoSquare, photo } from "@/data/photos";
import { useSiteActions } from "@/context/site-actions";
import { scrollToId } from "@/lib/utils";

/**
 * The façade's pillars become the index: yellow columns with the family
 * painted vertically on a black panel, exactly how the store labels its
 * front. Each pillar jumps to that family's folder below.
 */
function Pillars() {
  return (
    <nav aria-label="Familias de producto" className="relative">
      {/* The canopy over the pillars */}
      <div className="h-4 bg-ink md:h-5" aria-hidden />
      <ul className="grid grid-cols-4 gap-2 md:grid-cols-8 md:gap-3">
        {CATEGORIES.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ y: -24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={`#cat-${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(`cat-${c.id}`);
              }}
              className="group flex h-[15.5rem] flex-col items-center bg-yellow px-2 pb-2.5 pt-2.5 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:bg-white focus-visible:-translate-y-2 md:h-[22rem] md:px-2.5 md:pb-3 md:pt-3"
            >
              <span className="flex w-full flex-1 items-center justify-center bg-ink py-3">
                <span className="pillar-label text-[0.875rem] text-white md:text-[1.0625rem]" aria-hidden>
                  {c.short ?? c.name}
                </span>
                <span className="sr-only">{c.name}</span>
              </span>
              <span className="mt-2 text-[0.875rem] font-bold text-ink">Ver</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}

export function Categories() {
  const { requestQuote, explore } = useSiteActions();
  return (
    <section id="categorias" aria-labelledby="categorias-title" className="relative bg-ink pt-24 md:pt-32">
      <div className="frame frame-max">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem className="lg:col-span-7">
            <h2 id="categorias-title" className="display h2">
              Busca por familia.
            </h2>
          </RevealItem>
          <RevealItem className="lg:col-span-5">
            <p className="max-w-[44ch] text-[1.125rem] leading-[1.55] text-steel-soft">
              Las mismas familias que se leen en las columnas de nuestra sede. Abre una carpeta para ver ejemplos de cada
              una y pide la tuya por referencia.
            </p>
          </RevealItem>
        </Reveal>

        <div className="mt-12 md:mt-16">
          <Pillars />
        </div>
      </div>

      <div className="mt-20 bg-graphite-2 pb-28 pt-16 md:mt-28 md:pb-32 md:pt-24">
        <div className="frame frame-max">
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c.id} id={`cat-${c.id}`} className="scroll-mt-28">
                <AnimatedFolder
                  title={c.name}
                  subtitle={c.summary}
                  colors={c.folder}
                  categoryLabel={c.name}
                  className="h-full px-2 pt-24 sm:px-6 sm:pt-28"
                  items={c.photos.map((p) => ({
                    id: `${c.id}-${p.id}`,
                    title: p.title,
                    image: photo(p.id),
                    thumb: photoSquare(p.id),
                  }))}
                  onQuote={(item) => requestQuote(`${item.title} (${c.name})`)}
                  onExplore={() => explore({ category: c.id, query: "" })}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
