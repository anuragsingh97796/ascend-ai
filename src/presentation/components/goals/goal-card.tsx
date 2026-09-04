/**
 * Ascend AI — Goal Card Component
 */

"use client";

import * as React from "react";
import { Card, CardHeader, CardContent } from "@/presentation/ui/card";
import { Progress } from "@/presentation/ui/progress";
import { Badge } from "@/presentation/ui/badge";
import { Button } from "@/presentation/ui/button";
import {
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal, GoalPriority } from "@/domain/entities/Goal";

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  isDeleting?: boolean;
}

const priorityConfig: Record<
  GoalPriority,
  { label: string; variant: "success" | "warning" | "danger" | "secondary" }
> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "danger" },
};

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "secondary" | "ai" }
> = {
  active: { label: "Active", variant: "ai" },
  completed: { label: "Completed", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  archived: { label: "Archived", variant: "secondary" },
};

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  isDeleting,
}: GoalCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isCompleted = goal.status === "completed";

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

  const priority =
    priorityConfig[goal.priority || "medium"] ?? priorityConfig.medium;
  const status = statusConfig[goal.status] ?? statusConfig.active;

  return (
    <Card
      className={cn(
        "hover:border-brand-500/30 transition-colors duration-300 relative",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-text-primary truncate">
                {goal.title}
              </h3>
              {isCompleted && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={status.variant} className="capitalize text-xs">
                {status.label}
              </Badge>
              <Badge variant="secondary" className="capitalize text-xs">
                {goal.category}
              </Badge>
              <Badge variant={priority.variant} className="text-xs">
                {priority.label} priority
              </Badge>
            </div>
            {goal.targetDate && (
              <div className="flex items-center gap-1 text-xs text-text-tertiary">
                <Calendar className="h-3 w-3" />
                Target:{" "}
                {new Date(goal.targetDate + "T00:00:00").toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </div>
            )}
          </div>

          {/* Actions menu */}
          <div ref={menuRef} className="relative shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="-mt-1 -mr-2 text-text-tertiary h-8 w-8"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Goal options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-36 rounded-xl border border-border bg-surface shadow-lg py-1 animate-in fade-in-0 zoom-in-95 duration-150">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.(goal);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(goal);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {goal.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {goal.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-text-primary">Progress</span>
            <div className="flex items-center gap-1">
              {goal.progress >= 50 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-text-tertiary" />
              )}
              <span className="text-brand-500 font-medium">
                {goal.progress}%
              </span>
            </div>
          </div>
          <Progress
            value={goal.progress}
            variant={isCompleted ? "success" : "gradient"}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
