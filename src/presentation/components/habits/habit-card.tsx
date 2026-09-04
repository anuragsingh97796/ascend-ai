/**
 * Ascend AI — Habit Card Component
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Flame, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/presentation/ui/button";
import type { Habit, HabitStats } from "@/domain/entities/Habit";

interface HabitCardProps {
  habit: Habit;
  stats?: HabitStats;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
  onToggle?: (habitId: string, completedToday: boolean) => void;
  isTogglingCompletion?: boolean;
  isDeleting?: boolean;
}

const colorStyles = {
  purple: {
    icon: "bg-brand-500/10 text-brand-500 border-brand-500/20",
    check: "bg-brand-500 hover:bg-brand-600",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    check: "bg-cyan-500 hover:bg-cyan-600",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    check: "bg-emerald-500 hover:bg-emerald-600",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    check: "bg-amber-500 hover:bg-amber-600",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    check: "bg-rose-500 hover:bg-rose-600",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    check: "bg-indigo-500 hover:bg-indigo-600",
  },
};

export function HabitCard({
  habit,
  stats,
  onEdit,
  onDelete,
  onToggle,
  isTogglingCompletion,
  isDeleting,
}: HabitCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const colors = colorStyles[habit.color] ?? colorStyles.purple;
  const completedToday = stats?.completedToday ?? false;

  // Close menu on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleToggle = () => {
    if (isTogglingCompletion) return;
    if (!completedToday) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
    onToggle?.(habit.id, completedToday);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border bg-background hover:border-border/80 transition-all duration-300 shadow-sm group",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg",
            colors.icon
          )}
        >
          {habit.icon}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-text-primary text-sm truncate">
            {habit.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            {(stats?.currentStreak ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                <Flame className="h-3 w-3" />
                {stats!.currentStreak} day streak
              </span>
            )}
            {(stats?.currentStreak ?? 0) === 0 && (
              <span className="capitalize">{habit.frequency}</span>
            )}
            {stats && stats.completionRate > 0 && (
              <span className="text-text-disabled">
                · {stats.completionRate}% this week
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Menu */}
        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Habit options"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-border bg-surface shadow-lg py-1 animate-in fade-in-0 zoom-in-95 duration-150">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(habit);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(habit);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          disabled={isTogglingCompletion}
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
            completedToday
              ? cn("text-white border-transparent", colors.check)
              : "border-border bg-surface hover:bg-surface-hover text-transparent hover:text-text-disabled",
            isAnimating && "scale-110",
            isTogglingCompletion && "opacity-60 cursor-not-allowed"
          )}
          aria-label={completedToday ? "Undo check-in" : "Mark complete"}
        >
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
