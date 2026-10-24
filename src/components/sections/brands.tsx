import * as React from "react";
import { ExternalLink, Info, Search } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRANDS, demoBrandPlate, type Brand } from "@/data/brands";
import { categoryById } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { useSiteActions } from "@/context/site-actions";

function BrandPanel({ brand, onClose }: { brand: Brand | null; onClose: () => void }) {
  const { explore } = useSiteActions();
  const products = brand ? PRODUCTS.filter((p) => p.brandId === brand.id) : [];
  return (
    <Sheet open={!!brand} onClose={onClose} title={brand?.name ?? "Marca"}>
      {brand ? (
        <div className="flex flex-col gap-4 px-5 pb-8 md:px-7">
          {brand.demo ? (
            <p className="flex gap-2 bg-graphite-3 p-4 text-[1rem] leading-snug text-steel-soft">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden />
              Marca de demostración. El listado real de marcas que comercializa la tienda aún no se ha cargado.
            </p>
          ) : null}

          {brand.catalogUrl ? (
            <a
              href={brand.catalogUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 self-start rounded-[2px] bg-yellow px-5 text-sm font-[750] uppercase text-ink"
            >
              Abrir catálogo <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : null}

          {products.length ? (
            <Card className="bg-graphite-2">
              <CardHeader>
                <CardTitle className="text-lg">Productos asociados</CardTitle>
                <CardDescription className="text-[1rem] text-steel">
                  {products.length} {products.length === 1 ? "pieza" : "piezas"} en el catálogo de demostración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-1">
                  {products.map((p) => (
                    <li key={p.id} className="flex items-baseline justify-between gap-3 py-1.5 text-[1rem]">
                      <span className="font-semibold">{p.name}</span>
                      <span className="tabular shrink-0 text-steel">{categoryById(p.category).name}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-5 w-full"
                  onClick={() => {
                    onClose();
                    window.setTimeout(() => explore({ brandId: brand.id, query: "" }), 250);
                  }}
                >
                  <Search aria-hidden />
                  Ver en el buscador
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-[1.0625rem] text-steel-soft">
              Todavía no hay un catálogo cargado para esta marca. Pregúntanos por WhatsApp qué referencias manejamos.
            </p>
          )}
        </div>
      ) : null}
    </Sheet>
  );
}

export function Brands() {
  const [selected, setSelected] = React.useState<Brand | null>(null);
  const images = React.useMemo(
    () => BRANDS.map((b, i) => ({ src: b.logo ?? demoBrandPlate(b, i), alt: b.name })),
    [],
  );

  return (
    <section id="marcas" aria-labelledby="marcas-title" className="bg-ink py-24 md:py-32">
      <div className="frame frame-max">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 id="marcas-title" className="display h2 lg:col-span-8">
            Marcas que mueven la industria.
          </h2>
          <p className="max-w-[46ch] text-[1.0625rem] leading-[1.55] text-steel-soft lg:col-span-4">
            Trabajamos con soluciones y fabricantes para responder a las exigencias del sector automotor e industrial.
          </p>
        </div>
      </div>

      <TiltedGridHero
        images={images}
        speed={4.5}
        tileHeight={52}
        axis={50}
        curve={72}
        fade={14}
        className="mt-6 h-[17rem] w-full sm:h-[22rem] md:h-[26rem]"
      />

      <div className="frame frame-max">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <p className="flex max-w-md gap-2 text-[1rem] leading-snug text-steel">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden />
              Logotipos de demostración: se reemplazan por las marcas reales que maneja la tienda.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Elegir una marca">
              {BRANDS.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(b)}
                    className="h-10 rounded-[2px] bg-graphite-3 px-3.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-yellow hover:text-ink"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
        </div>
      </div>
      <BrandPanel brand={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
