/**
 * Ascend AI — Circular Progress Ring
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  variant?: "brand" | "cyan" | "emerald" | "amber" | "rose" | "indigo";
  showValue?: boolean;
  label?: string;
  className?: string;
}

const colorMap = {
  brand: { stroke: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)" },
  cyan: { stroke: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)" },
  emerald: { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
  amber: { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
  rose: { stroke: "#f43f5e", glow: "rgba(244, 63, 94, 0.4)" },
  indigo: { stroke: "#6366f1", glow: "rgba(99, 102, 241, 0.4)" },
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  variant = "brand",
  showValue = true,
  label,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset =
    circumference - (normalizedValue / 100) * circumference;

  const color = colorMap[variant] || colorMap.brand;

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center",
        className
      )}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/40 fill-none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          className="fill-none"
          style={{
            filter: `drop-shadow(0 0 6px ${color.glow})`,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            {Math.round(normalizedValue)}%
          </span>
          {label && (
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
