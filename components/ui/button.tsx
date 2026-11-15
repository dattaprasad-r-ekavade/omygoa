import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gp-indigo)]/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--gp-indigo)] text-white hover:bg-[#1a3466]",
        outline: "border border-[var(--gp-line-strong)] bg-white text-[var(--gp-ink)] hover:bg-[var(--gp-canvas-2)]",
        ghost: "text-[var(--gp-ink)] hover:bg-black/5",
        soft: "bg-[var(--gp-butter)] text-[var(--gp-butter-ink)] hover:bg-[var(--gp-butter-deep)]",
        destructive: "bg-[#c52842] text-white hover:bg-[#a11f35]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
