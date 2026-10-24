import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Info, MessageSquareText, Search, X } from "lucide-react";
import { Reveal, RevealItem } from "@/components/layout/reveal";
import { ProductSheet } from "@/components/products/product-sheet";
import { ProductCard } from "@/components/ui/product-card-2";
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
const PAGE = 8;

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

const selectBase =
  "h-14 w-full appearance-none rounded-[2px] bg-ink bg-no-repeat pl-4 pr-10 text-[1rem] font-semibold text-white [background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23ffb900' stroke-width='2.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")] [background-position:right_14px_center]";

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectBase}>
        {children}
      </select>
    </div>
  );
}

export function PartFinder() {
  const { finder, requestQuote } = useSiteActions();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CategoryId | null>(null);
  const [vehicle, setVehicle] = React.useState<VehicleType | null>(null);
  const [brandId, setBrandId] = React.useState<string | null>(null);
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
  }, [finder]);

  const suggestions = React.useMemo(() => provider.suggest(query, PRODUCTS), [query]);
  const hits = React.useMemo(
    () => provider.search(query, { category, vehicle, brandId }, PRODUCTS),
    [query, category, vehicle, brandId],
  );
  const filtered = !!(query.trim() || category || vehicle || brandId);
  const visible = showAll ? hits : hits.slice(0, PAGE);

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
    <section id="productos" aria-labelledby="buscador-title" className="bg-yellow py-24 text-ink md:py-32">
      <div id="buscador" className="frame frame-max scroll-mt-24">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem className="lg:col-span-8">
            <h2 id="buscador-title" className="display h2">
              Encuentra la pieza que necesitas.
            </h2>
          </RevealItem>
          <RevealItem className="lg:col-span-4">
            <p className="max-w-[42ch] text-[1.125rem] leading-[1.55]">
              Escribe el nombre, la referencia, la marca o para qué sirve, y filtra si lo necesitas.
            </p>
          </RevealItem>
        </Reveal>

        {/* One bar: search + three filters */}
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-[minmax(0,2.2fr)_repeat(3,minmax(0,1fr))]">
          <form
            role="search"
            className="relative sm:col-span-3 lg:col-span-1"
            onSubmit={(e) => {
              e.preventDefault();
              setListOpen(false);
            }}
          >
            <label htmlFor="buscar" className="sr-only">
              Buscar repuesto
            </label>
            <div className="flex h-14 items-center gap-3 bg-ink px-4 text-white focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-[3px] focus-within:outline-ink">
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
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Borrar búsqueda"
                  className="flex h-10 w-10 items-center justify-center text-steel hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </div>
            {listOpen && suggestions.length > 0 ? (
              <ul
                id={listId}
                role="listbox"
                aria-label="Sugerencias"
                className="absolute inset-x-0 top-full z-20 mt-1 bg-ink py-1 text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]" /* taste-skill-ignore */
              >
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

          <FilterSelect
            id="f-familia"
            label="Familia"
            value={category ?? ""}
            onChange={(v) => {
              setCategory((v || null) as CategoryId | null);
              setShowAll(false);
            }}
          >
            <option value="">Todas las familias</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            id="f-vehiculo"
            label="Tipo de vehículo"
            value={vehicle ?? ""}
            onChange={(v) => {
              setVehicle((v || null) as VehicleType | null);
              setShowAll(false);
            }}
          >
            <option value="">Todo tipo de vehículo</option>
            {VEHICLE_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            id="f-marca"
            label="Marca"
            value={brandId ?? ""}
            onChange={(v) => {
              setBrandId(v || null);
              setShowAll(false);
            }}
          >
            <option value="">Todas las marcas</option>
            {BRANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </FilterSelect>
        </div>

        {/* Status line */}
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2" aria-live="polite">
          {filtered ? (
            <p className="text-[1.0625rem] font-bold">
              {hits.length} {hits.length === 1 ? "resultado" : "resultados"}
            </p>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[1rem]">
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
          )}
          <div className="flex items-baseline gap-5">
            <p className="flex items-center gap-1.5 text-[1rem]">
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              Catálogo de demostración ({PRODUCTS.length} piezas)
            </p>
            {filtered ? (
              <button type="button" onClick={reset} className="text-[1rem] font-semibold underline decoration-2 underline-offset-4 hover:no-underline">
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>

        {/* Results */}
        {hits.length ? (
          <>
            <motion.ul
              key={`${query}|${category}|${vehicle}|${brandId}`}
              className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4"
              variants={grid}
              initial="hidden"
              animate="visible"
            >
              {visible.map(({ product: p }) => (
                <motion.li key={p.id} variants={item}>
                  <ProductCard
                    imageUrl={photoSquare(p.photo)}
                    name={p.name}
                    meta={`${p.ref} · ${brandById(p.brandId)?.name ?? ""}`}
                    tagline={`${categoryById(p.category).name}. ${p.use}.`}
                    className="text-white"
                    footer={
                      <>
                        <Button size="sm" className="flex-1" onClick={() => requestQuote(productEnquiry(p.name, p.ref))}>
                          <MessageSquareText aria-hidden />
                          Cotizar
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setSheet(p)} aria-label={`Ver ficha de ${p.name}`}>
                          Ficha
                        </Button>
                      </>
                    }
                  />
                </motion.li>
              ))}
            </motion.ul>
            {hits.length > visible.length ? (
              <div className="mt-8 flex justify-center">
                <Button variant="ink" size="lg" onClick={() => setShowAll(true)}>
                  Ver los {hits.length} productos
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-8 bg-ink p-6 text-white md:p-10">
            <p className="text-[1.625rem] font-[800] uppercase leading-tight [font-stretch:108%]">
              No está en el catálogo de demostración.
            </p>
            <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-[1.55] text-steel-soft">
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
      <ProductSheet product={sheet} onClose={() => setSheet(null)} />
    </section>
  );
}
