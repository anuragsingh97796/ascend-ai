/**
 * Ascend AI — Badge Component
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-500 text-white hover:bg-brand-500/80",
        secondary:
          "border-transparent bg-surface text-text-secondary hover:bg-surface-hover",
        destructive: "border-transparent bg-error text-white hover:bg-error/80",
        outline: "text-text-primary",
        ai: "border-brand-500/30 bg-brand-500/10 text-brand-500",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
        danger: "border-rose-500/30 bg-rose-500/10 text-rose-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
