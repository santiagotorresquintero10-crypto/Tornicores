import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * One button shape for the whole site: square-cut, flat fill, heavy wide
 * label, like the lettering on the store's pillars.
 */
const buttonVariants = cva(
  [
    "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-[2px]",
    "font-[750] uppercase tracking-[0.02em] [font-stretch:112%]",
    "transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:translate-y-px active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:size-[1.1em] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-yellow text-ink hover:bg-white",
        secondary: "bg-graphite-3 text-white hover:bg-[#33383f]",
        ink: "bg-ink text-white hover:bg-graphite-3",
        light: "bg-white text-ink hover:bg-yellow",
        ghost: "bg-transparent text-white hover:text-yellow",
      },
      size: {
        sm: "h-10 px-4 text-[0.875rem]",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-7 text-[1rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type LinkButtonProps = React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>;

function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, LinkButton, buttonVariants };
