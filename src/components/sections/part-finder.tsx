import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageSquareText, Search, X } from "lucide-react";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { ProductSheet, SpecRow } from "@/components/products/product-sheet";
import { Button } from "@/components/ui/button";
import { BRANDS, brandById } from "@/data/brands";
import { CATEGORIES, categoryById, type CategoryId } from "@/data/categories";
import { photoSquare } from "@/data/photos";
import { PRODUCTS, VEHICLE_TYPES, type Product, type VehicleType } from "@/data/products";
import { useSiteActions } from "@/context/site-actions";
import { localSearch, type SearchProvider } from "@/lib/search";
import { cn } from "@/lib/utils";
import { productEnquiry } from "@/lib/whatsapp";

const provider: SearchProvider = localSearch;
const EXAMPLES = ["válvula relevadora", "perno banjo", "DEMO-HID-001", "amortiguador"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-10 rounded-[2px] px-3.5 text-[1rem] font-semibold transition-colors",
        active ? "bg-yellow text-ink" : "bg-graphite-3 text-white hover:bg-[#33383f]",
      )}
    >
      {children}
    </button>
  );
}

function ResultRow({ product, open, onToggle, onSheet }: { product: Product; open: boolean; onToggle: () => void; onSheet: () => void }) {
  const { requestQuote } = useSiteActions();
  const panelId = React.useId();
  return (
    <li className="bg-graphite">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-graphite-3 md:px-5"
        >
          <img src={photoSquare(product.photo)} alt="" loading="lazy" className="h-11 w-11 shrink-0 object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[1.0625rem] font-[750]">{product.name}</span>
            <span className="tabular block truncate text-[0.875rem] text-steel">
              {product.ref} · {categoryById(product.category).name}
            </span>
          </span>
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-yellow transition-transform duration-300", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5">
              <dl className="text-white [&_.leader]:opacity-30 [&_dd]:text-steel-soft">
                <SpecRow label="Marca" value={brandById(product.brandId)?.name ?? "—"} />
                <SpecRow label="Uso típico" value={product.use} />
                <SpecRow label="Se usa en" value={product.vehicles.join(", ")} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => requestQuote(productEnquiry(product.name, product.ref))}>
                  <MessageSquareText aria-hidden />
                  Cotizar
                </Button>
                <Button size="sm" variant="secondary" onClick={onSheet}>
                  Ver ficha
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function PartFinder() {
  const { finder, requestQuote } = useSiteActions();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CategoryId | null>(null);
  const [vehicle, setVehicle] = React.useState<VehicleType | null>(null);
  const [brandId, setBrandId] = React.useState<string | null>(null);
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<Product | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  // Combobox state
  const [listOpen, setListOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();

  // Requests from other sections ("Ver productos", "Explorar productos").
  React.useEffect(() => {
    if (!finder.nonce) return;
    setQuery(finder.query ?? "");
    setCategory(finder.category ?? null);
    setBrandId(finder.brandId ?? null);
    setVehicle(null);
    setShowAll(false);
    setOpenRow(null);
  }, [finder]);

  const suggestions = React.useMemo(() => provider.suggest(query, PRODUCTS), [query]);
  const hits = React.useMemo(
    () => provider.search(query, { category, vehicle, brandId }, PRODUCTS),
    [query, category, vehicle, brandId],
  );
  const filtered = !!(query.trim() || category || vehicle || brandId);
  const visible = showAll ? hits : hits.slice(0, 8);

  const choose = (s: string) => {
    setQuery(s);
    setListOpen(false);
    setActiveIdx(-1);
    setShowAll(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setListOpen(true);
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && listOpen && activeIdx >= 0) {
      e.preventDefault();
      choose(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setListOpen(false);
    }
  };

  const reset = () => {
    setQuery("");
    setCategory(null);
    setVehicle(null);
    setBrandId(null);
    setShowAll(false);
    inputRef.current?.focus();
  };

  return (
    <section id="buscador" aria-labelledby="buscador-title" className="bg-yellow py-24 text-ink md:py-32">
      <div className="frame frame-max grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:col-span-12">
          <RevealItem className="lg:col-span-8">
            <h2 id="buscador-title" className="display h2">
              Encuentra la pieza que necesitas.
            </h2>
          </RevealItem>
          <RevealItem className="lg:col-span-4">
            <p className="max-w-[42ch] text-[1.125rem] leading-[1.55]">
              Escribe el nombre, la referencia, la marca o para qué sirve. Filtra por familia y tipo de vehículo.
            </p>
          </RevealItem>
        </Reveal>

        <div className="lg:col-span-5">
          <form
            role="search"
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              setListOpen(false);
            }}
          >
            <label htmlFor="buscar" className="sr-only">
              Buscar repuesto
            </label>
            <div className="flex h-16 items-center gap-3 bg-ink px-4 text-white focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-[3px] focus-within:outline-ink">
              <Search className="h-6 w-6 shrink-0 text-yellow" aria-hidden />
              <input
                ref={inputRef}
                id="buscar"
                type="search"
                role="combobox"
                aria-expanded={listOpen && suggestions.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeIdx >= 0 ? `${listId}-${activeIdx}` : undefined}
                autoComplete="off"
                placeholder="Ej.: válvula relevadora"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setListOpen(true);
                  setActiveIdx(-1);
                  setShowAll(false);
                }}
                onFocus={() => setListOpen(true)}
                onBlur={() => window.setTimeout(() => setListOpen(false), 120)}
                onKeyDown={onKeyDown}
                className="h-full min-w-0 flex-1 bg-transparent text-[1.125rem] font-medium placeholder:text-steel focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="flex h-10 w-10 items-center justify-center text-steel hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </div>
            {listOpen && suggestions.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="Sugerencias" className="absolute inset-x-0 top-full z-20 mt-1 bg-ink py-1 text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]" /* taste-skill-ignore */>
                {suggestions.map((s, i) => (
                  <li
                    key={s}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(s);
                    }}
                    className={cn("cursor-pointer px-4 py-2.5 text-[1.0625rem]", i === activeIdx ? "bg-yellow text-ink" : "hover:bg-graphite-3")}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
          </form>

          {!query ? (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[1rem]">
              <span>Prueba:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => choose(ex)}
                  className="font-semibold underline decoration-2 underline-offset-4 hover:no-underline"
                >
                  {ex}
                </button>
              ))}
            </div>
          ) : null}

          <fieldset className="mt-9">
            <legend className="text-[1rem] font-bold">Familia</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c.id} active={category === c.id} onClick={() => setCategory((v) => (v === c.id ? null : c.id))}>
                  {c.name}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className="text-[1rem] font-bold">Tipo de vehículo</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((v) => (
                <Chip key={v} active={vehicle === v} onClick={() => setVehicle((x) => (x === v ? null : v))}>
                  {v}
                </Chip>
              ))}
            </div>
          </fieldset>
          <div className="mt-6">
            <label htmlFor="marca" className="text-[1rem] font-bold">
              Marca
            </label>
            <select
              id="marca"
              value={brandId ?? ""}
              onChange={(e) => setBrandId(e.target.value || null)}
              className="mt-3 block h-12 w-full max-w-xs rounded-[2px] bg-ink px-3 text-[1.0625rem] font-medium text-white"
            >
              <option value="">Todas las marcas</option>
              {BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 border-b-0 pb-4">
            <p className="text-[1.0625rem] font-bold">
              {filtered ? `${hits.length} ${hits.length === 1 ? "resultado" : "resultados"}` : `${PRODUCTS.length} piezas en el catálogo de demostración`}
            </p>
            {filtered ? (
              <button type="button" onClick={reset} className="text-[1rem] font-semibold underline decoration-2 underline-offset-4 hover:no-underline">
                Limpiar filtros
              </button>
            ) : null}
          </div>

          {hits.length ? (
            <>
              <ul className="flex flex-col gap-1.5 text-white">
                {visible.map((h) => (
                  <ResultRow
                    key={h.product.id}
                    product={h.product}
                    open={openRow === h.product.id}
                    onToggle={() => setOpenRow((o) => (o === h.product.id ? null : h.product.id))}
                    onSheet={() => setSheet(h.product)}
                  />
                ))}
              </ul>
              {hits.length > visible.length ? (
                <Button variant="ink" className="mt-4 w-full" onClick={() => setShowAll(true)}>
                  Ver los {hits.length} resultados
                </Button>
              ) : null}
            </>
          ) : (
            <div className="bg-ink p-6 text-white md:p-8">
              <p className="text-[1.625rem] font-[800] uppercase leading-tight [font-stretch:108%]">
                No está en el catálogo de demostración.
              </p>
              <p className="mt-3 max-w-[48ch] text-[1.0625rem] leading-[1.55] text-steel-soft">
                Eso no significa que no la tengamos: el inventario real aún no está cargado en la página. Pregúntala
                directamente y te respondemos por WhatsApp.
              </p>
              <Button className="mt-6" onClick={() => requestQuote(query.trim() || (category ? categoryById(category).name : ""))}>
                <MessageSquareText aria-hidden />
                Preguntar por “{query.trim() || "esta pieza"}”
              </Button>
            </div>
          )}
        </div>
      </div>
      <ProductSheet product={sheet} onClose={() => setSheet(null)} />
    </section>
  );
}
