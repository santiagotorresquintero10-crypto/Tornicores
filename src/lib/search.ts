import { normalize } from "./utils";
import { CATEGORIES, type CategoryId } from "@/data/categories";
import { BRANDS } from "@/data/brands";
import type { Product, VehicleType } from "@/data/products";

/**
 * Part search.
 *
 * Today: local, accent-insensitive text search with field weights over the
 * catalogue in memory. No AI is involved.
 *
 * Tomorrow: implement `SearchProvider` with a semantic service (embeddings,
 * compatibility graph) and pass it to `searchParts`; the UI only depends on
 * this interface, so nothing else changes.
 */
export type SearchFilters = {
  category?: CategoryId | null;
  brandId?: string | null;
  vehicle?: VehicleType | null;
};

export type SearchHit = { product: Product; score: number; matched: string[] };

export interface SearchProvider {
  search(query: string, filters: SearchFilters, products: Product[]): SearchHit[];
  /** Short completions for the input, most useful first. */
  suggest(query: string, products: Product[]): string[];
}

type Field = { text: string; weight: number; label: string };

function fields(p: Product): Field[] {
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const brand = BRANDS.find((b) => b.id === p.brandId);
  return [
    { text: p.name, weight: 6, label: "nombre" },
    { text: p.ref, weight: 8, label: "referencia" },
    { text: p.terms.join(" "), weight: 4, label: "término" },
    { text: cat?.name ?? "", weight: 3, label: "categoría" },
    { text: brand?.name ?? "", weight: 3, label: "marca" },
    { text: p.use, weight: 2, label: "aplicación" },
    { text: p.vehicles.join(" "), weight: 1, label: "vehículo" },
  ];
}

function passes(p: Product, f: SearchFilters) {
  if (f.category && p.category !== f.category) return false;
  if (f.brandId && p.brandId !== f.brandId) return false;
  if (f.vehicle && !p.vehicles.includes(f.vehicle)) return false;
  return true;
}

export const localSearch: SearchProvider = {
  search(query, filters, products) {
    const tokens = normalize(query).split(" ").filter((t) => t.length > 0);
    const pool = products.filter((p) => passes(p, filters));
    if (!tokens.length) return pool.map((product) => ({ product, score: 0, matched: [] }));

    const hits: SearchHit[] = [];
    for (const product of pool) {
      let score = 0;
      const matched = new Set<string>();
      let all = true;
      const fs = fields(product).map((f) => ({ ...f, n: normalize(f.text) }));
      for (const t of tokens) {
        let best = 0;
        for (const f of fs) {
          const words = f.n.split(" ");
          let s = 0;
          if (words.includes(t)) s = 3;
          else if (words.some((w) => w.startsWith(t))) s = 2;
          else if (t.length > 2 && f.n.includes(t)) s = 1;
          if (s) {
            matched.add(f.label);
            best = Math.max(best, s * f.weight);
          }
        }
        if (!best) all = false;
        score += best;
      }
      // Every word has to match somewhere; partial matches rank below.
      if (score > 0) hits.push({ product, score: all ? score * 2 : score, matched: [...matched] });
    }
    return hits.sort((a, b) => b.score - a.score);
  },

  suggest(query, products) {
    const q = normalize(query);
    if (q.length < 2) return [];
    // Keyed by the normalised text so "Válvula de pedal" and "valvula de pedal"
    // collapse into one suggestion (the first, properly written one wins).
    const pool = new Map<string, number>();
    const label = new Map<string, string>();
    const add = (s: string, w: number) => {
      const n = normalize(s);
      if (!n.includes(q)) return;
      if (!label.has(n)) label.set(n, s);
      pool.set(n, Math.max(pool.get(n) ?? 0, w + (n.startsWith(q) ? 2 : 0)));
    };
    for (const p of products) {
      add(p.name, 3);
      add(p.ref, 2);
      p.terms.forEach((t) => add(t, 1));
    }
    CATEGORIES.forEach((c) => add(c.name, 2));
    return [...pool.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
      .slice(0, 6)
      .map(([n]) => label.get(n)!);
  },
};
