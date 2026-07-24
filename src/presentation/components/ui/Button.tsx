"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
> {
  variant?: "primary" | "glass" | "ghost";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  const baseStyle = {
    padding: "12px 24px",
    borderRadius: "var(--radius-full)",
    fontFamily: "var(--font-inter)",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    outline: "none",
    position: "relative" as const,
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "box-shadow 0.3s ease",
  };

  const variants = {
    primary: {
      background: "var(--foreground)",
      color: "var(--background)",
      boxShadow: "0 4px 14px rgba(255, 255, 255, 0.2)",
    },
    glass: {
      background: "var(--glass-bg)",
      color: "var(--foreground)",
      border: "1px solid var(--glass-border)",
      backdropFilter: "blur(12px)",
    },
    ghost: {
      background: "transparent",
      color: "var(--foreground)",
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ ...baseStyle, ...variants[variant] }}
      {...props}
    >
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {children}
      </span>
    </motion.button>
  );
};
