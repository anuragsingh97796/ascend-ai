/**
 * Ascend AI — Progress Component
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?:
    | "brand"
    | "success"
    | "warning"
    | "error"
    | "cyan"
    | "indigo"
    | "emerald"
    | "amber"
    | "rose"
    | "default"
    | "gradient";
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  className?: string;
  indicatorClassName?: string;
  animate?: boolean;
}

const variantFill: Record<string, string> = {
  brand: "bg-brand-500",
  default: "bg-brand-500",
  gradient: "bg-gradient-to-r from-brand-500 to-indigo-500",
  success: "bg-accent-emerald",
  warning: "bg-accent-amber",
  error: "bg-error",
  cyan: "bg-accent-cyan",
  indigo: "bg-accent-indigo",
  emerald: "bg-accent-emerald",
  amber: "bg-accent-amber",
  rose: "bg-accent-rose",
};

const sizeMap: Record<string, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value = 0,
  max = 100,
  variant = "brand",
  size = "md",
  label,
  showValue = false,
  className,
  indicatorClassName,
  animate = true,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-text-primary">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-medium text-text-secondary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-hover",
          sizeMap[size] || "h-2",
          className
        )}
      >
        <motion.div
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
          className={cn(
            "h-full rounded-full",
            variantFill[variant] || "bg-brand-500",
            indicatorClassName
          )}
        />
      </div>
    </div>
  );
}
