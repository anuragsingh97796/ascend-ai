"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, Flame, BookOpen, Brain } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/habits", label: "Habits", icon: Flame },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/coach", label: "AI Coach", icon: Brain },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        boxShadow: "inset -1px 0 0 rgba(255, 255, 255, 0.08), 10px 0 30px rgba(0,0,0,0.5)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        zIndex: 10,
      }}
    >
      <div style={{ padding: "0 12px" }}>
        <h2 className="text-gradient" style={{ fontSize: 20, fontWeight: 700 }}>
          Ascend AI
        </h2>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                color: isActive ? "var(--foreground)" : "var(--text-secondary)",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                fontWeight: isActive ? 500 : 400,
                fontSize: 14,
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "var(--accent)",
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                style={{ color: isActive ? "var(--accent)" : "inherit" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
