import { AnimatedFolder } from "@/components/ui/3d-folder";
import { CATEGORIES } from "@/data/categories";
import { photoSquare, photo } from "@/data/photos";
import { useSiteActions } from "@/context/site-actions";

/** The eight product families as 3D folders of reference photos. */
export function Categories() {
  const { requestQuote, explore } = useSiteActions();
  return (
    <section id="categorias" aria-labelledby="categorias-title" className="relative bg-graphite-2 py-24 md:py-32">
      <h2 id="categorias-title" className="sr-only">
        Categorías de productos
      </h2>
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
    </section>
  );
}
