import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Info } from "lucide-react";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { ProductSheet } from "@/components/products/product-sheet";
import { brandById } from "@/data/brands";
import { categoryById } from "@/data/categories";
import { photoSquare } from "@/data/photos";
import { PRODUCTS, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Strip colours rotate so a regular grid still reads as varied tags. */
const TAGS = [
  "bg-yellow text-ink",
  "bg-[#f3f4f6] text-ink",
  "bg-graphite-3 text-white",
  "bg-white text-ink",
];

function ProductTile({ product, index, onOpen }: { product: Product; index: number; onOpen: () => void }) {
  const cat = categoryById(product.category);
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full text-left"
        aria-label={`${product.name}, referencia ${product.ref}. Ver ficha técnica`}
      >
        <span className="relative block aspect-square overflow-hidden bg-graphite">
          <img
            src={photoSquare(product.photo)}
            alt=""
            loading="lazy"
            decoding="async"
            width={720}
            height={720}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07]"
          />
          <span className="absolute right-3 top-3 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-yellow text-ink opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </span>
        </span>
        <span className={cn("block px-3.5 pb-3.5 pt-3", TAGS[index % TAGS.length])}>
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[0.875rem] font-semibold">
            <span className="tabular">{product.ref}</span>
            <span>{brandById(product.brandId)?.name}</span>
          </span>
          <span className="mt-1.5 block text-[1.0625rem] font-[800] uppercase leading-tight [font-stretch:104%]">
            {product.name}
          </span>
          <span className="mt-1 block text-[0.875rem] font-medium opacity-80">{cat.name}</span>
        </span>
      </button>
    </motion.li>
  );
}

export function FeaturedProducts() {
  const [open, setOpen] = React.useState<Product | null>(null);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);

  return (
    <section id="productos" aria-labelledby="productos-title" className="bg-ink py-24 md:py-32">
      <div className="frame frame-max">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem className="lg:col-span-8">
            <h2 id="productos-title" className="display h2">
              Precisión en cada pieza.
            </h2>
          </RevealItem>
          <RevealItem className="lg:col-span-4">
            <p className="text-[1.125rem] leading-[1.55] text-steel-soft">
              Una muestra de lo que se mueve en el mostrador. Toca una pieza para ver su ficha y pedir precio.
            </p>
          </RevealItem>
        </Reveal>

        <p className="mt-8 flex max-w-3xl gap-2 text-[1rem] leading-snug text-steel">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden />
          Catálogo de demostración: referencias, marcas e imágenes son de ejemplo hasta cargar el inventario real.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-x-2 gap-y-7 md:gap-x-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductTile key={p.id} product={p} index={i} onOpen={() => setOpen(p)} />
          ))}
        </ul>
      </div>
      <ProductSheet product={open} onClose={() => setOpen(null)} />
    </section>
  );
}
