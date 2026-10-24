import { Info, MessageSquareText } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { brandById } from "@/data/brands";
import { categoryById } from "@/data/categories";
import { photo } from "@/data/photos";
import type { Product } from "@/data/products";
import { useSiteActions } from "@/context/site-actions";
import { productEnquiry } from "@/lib/whatsapp";

/** A spec row set like a printed price list: label, dot leader, value. */
export function SpecRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline py-[0.55rem]">
      <dt className="shrink-0 text-[1rem] font-semibold">{label}</dt>
      <span className="leader" aria-hidden />
      <dd className={muted ? "text-right text-[1rem] text-[#4b5058]" : "tabular text-right text-[1rem] font-semibold"}>
        {value}
      </dd>
    </div>
  );
}

export function ProductSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { requestQuote } = useSiteActions();
  const p = product;
  return (
    <Sheet open={!!p} onClose={onClose} title="Ficha técnica">
      {p ? (
        <div className="px-5 pb-8 md:px-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-graphite-2">
            <img src={photo(p.photo)} alt={p.name} className="h-full w-full object-cover" />
            <p className="absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[0.875rem] font-semibold text-white">
              Imagen de referencia
            </p>
          </div>

          {/* The sheet itself: paper on graphite, cut edge at the bottom. */}
          <div className="zigzag-bottom mt-5 bg-[#f3f4f6] px-5 pt-6 text-ink">
            <p className="text-[1rem] font-semibold text-[#4b5058]">{categoryById(p.category).name}</p>
            <h3 className="mt-1 text-[1.625rem] font-[850] uppercase leading-[1] [font-stretch:105%]">{p.name}</h3>
            <dl className="mt-5">
              <SpecRow label="Referencia" value={p.ref} />
              <SpecRow label="Marca" value={brandById(p.brandId)?.name ?? "—"} />
              <SpecRow label="Categoría" value={categoryById(p.category).name} />
              <SpecRow label="Uso típico" value={p.use} />
              <SpecRow label="Se usa en" value={p.vehicles.join(", ")} />
              <SpecRow label="Compatibilidad" value={p.compatibility ?? "Confirmar con tu referencia"} muted={!p.compatibility} />
              <SpecRow label="Disponibilidad" value={p.availability ?? "Consultar"} muted={!p.availability} />
              <SpecRow label="Precio" value={p.price ?? "Bajo cotización"} muted={!p.price} />
            </dl>
          </div>

          <p className="mt-5 flex gap-2 text-[1rem] leading-snug text-steel-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden />
            Ficha de demostración. Para confirmar la pieza exacta envía la referencia original, una foto o los datos del
            vehículo.
          </p>

          <Button
            size="lg"
            className="mt-6 w-full"
            data-autofocus
            onClick={() => {
              onClose();
              window.setTimeout(() => requestQuote(productEnquiry(p.name, p.ref)), 250);
            }}
          >
            <MessageSquareText aria-hidden />
            Solicitar cotización
          </Button>
        </div>
      ) : null}
    </Sheet>
  );
}
