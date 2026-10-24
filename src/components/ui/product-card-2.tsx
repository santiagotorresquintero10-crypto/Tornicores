import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Product card (adapted from the supplied product-card-2).
 * Changes for TORNIRACORES 2:
 * - price, original price and offer are optional: without a real price the
 *   card says "Precio bajo cotización" instead of inventing one;
 * - Colombian pesos by default (es-CO, COP);
 * - optional meta line (reference · brand) and a footer slot for actions;
 * - brand palette: graphite card, square corners, no resting shadow.
 */
export interface ProductCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  imageUrl: string;
  name: string;
  tagline: string;
  /** Shown above the name, e.g. "DEMO-TOR-001 · Marca demo A". */
  meta?: string;
  price?: number;
  currency?: string;
  isCouponPrice?: boolean;
  originalPrice?: number;
  offerText?: string;
  /** Actions under the card body (quote, details). */
  footer?: React.ReactNode;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    { className, imageUrl, name, tagline, meta, price, currency = "COP", isCouponPrice = false, originalPrice, offerText, footer, ...props },
    ref,
  ) => {
    const formatPrice = (amount: number) =>
      new Intl.NumberFormat("es-CO", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden rounded-[4px] bg-graphite text-card-foreground",
          className,
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {/* Product image on a clean light plate */}
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#f3f4f6]">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="flex flex-grow flex-col gap-1.5 p-5">
          {meta ? <p className="tabular text-[0.875rem] font-semibold text-steel">{meta}</p> : null}
          <h3 className="text-[1.125rem] font-[800] uppercase leading-tight [font-stretch:104%]">{name}</h3>
          <p className="text-[1rem] leading-snug text-steel-soft">{tagline}</p>

          {/* Price and offer */}
          <div className="mt-auto flex flex-col gap-2 pt-4">
            {price !== undefined ? (
              <div className="flex flex-col">
                <span className="text-[1.625rem] font-[800]">{formatPrice(price)}</span>
                {isCouponPrice && <span className="text-[0.875rem] font-semibold text-yellow">Precio con cupón</span>}
              </div>
            ) : (
              <span className="text-[1rem] font-bold text-white">Precio bajo cotización</span>
            )}
            {originalPrice || offerText ? (
              <div className="flex w-fit items-center gap-2 rounded-full bg-graphite-3 px-3 py-1 text-[0.875rem]">
                {originalPrice ? <span className="text-steel line-through">{formatPrice(originalPrice)}</span> : null}
                {offerText ? <span className="font-semibold text-yellow">{offerText}</span> : null}
              </div>
            ) : null}
          </div>
        </div>

        {footer ? <div className="flex gap-2 px-5 pb-5">{footer}</div> : null}
      </motion.div>
    );
  },
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
