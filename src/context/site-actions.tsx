import * as React from "react";
import type { CategoryId } from "@/data/categories";
import { scrollToId } from "@/lib/utils";

/**
 * Cross-section actions: any "Cotizar" button fills the quote form, and any
 * "Explorar productos" button drives the part finder.
 */
type FinderRequest = { query?: string; category?: CategoryId | null; brandId?: string | null; nonce: number };

type SiteActions = {
  quoteProduct: string;
  quoteNonce: number;
  requestQuote: (product?: string) => void;
  finder: FinderRequest;
  explore: (req: Omit<FinderRequest, "nonce">) => void;
};

const Ctx = React.createContext<SiteActions | null>(null);

export function SiteActionsProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = React.useState({ product: "", nonce: 0 });
  const [finder, setFinder] = React.useState<FinderRequest>({ nonce: 0 });

  const requestQuote = React.useCallback((product?: string) => {
    setQuote((q) => ({ product: product ?? q.product, nonce: q.nonce + 1 }));
    requestAnimationFrame(() => scrollToId("cotizar"));
  }, []);

  const explore = React.useCallback((req: Omit<FinderRequest, "nonce">) => {
    setFinder((f) => ({ ...req, nonce: f.nonce + 1 }));
    requestAnimationFrame(() => scrollToId("buscador"));
  }, []);

  const value = React.useMemo(
    () => ({ quoteProduct: quote.product, quoteNonce: quote.nonce, requestQuote, finder, explore }),
    [quote, requestQuote, finder, explore],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteActions() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useSiteActions must be used inside SiteActionsProvider");
  return ctx;
}
