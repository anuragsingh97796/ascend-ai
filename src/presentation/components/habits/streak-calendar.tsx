/**
 * Ascend AI — Streak Calendar Component
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/presentation/ui/card";
import { cn } from "@/lib/utils";
import type { Habit, HabitStats } from "@/domain/entities/Habit";

interface StreakCalendarProps {
  habit: Habit;
  stats: HabitStats;
}

const colorMap: Record<string, string> = {
  purple: "bg-brand-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
};

export function StreakCalendar({ habit, stats }: StreakCalendarProps) {
  // Generate last 49 days (7 weeks)
  const days = React.useMemo(() => {
    const arr: string[] = [];
    for (let i = 48; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  }, []);

  const completedSet = new Set(stats.completedDates);
  const fillColor = colorMap[habit.color] ?? "bg-brand-500";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{habit.icon}</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {habit.name}
            </span>
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span>🔥 {stats.currentStreak} day streak</span>
              <span>Best: {stats.longestStreak} days</span>
              <span>{stats.completionRate}% this week</span>
            </div>
          </div>
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}
        >
          {days.map((day) => {
            const completed = completedSet.has(day);
            const isToday = day === new Date().toISOString().split("T")[0];
            return (
              <div
                key={day}
                title={`${day}${completed ? " ✓" : ""}`}
                className={cn(
                  "aspect-square rounded-sm transition-colors",
                  completed
                    ? fillColor
                    : "bg-surface-hover border border-border/50",
                  isToday && !completed && "border-brand-500/50"
                )}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-xs text-text-tertiary">
          <span>7 weeks ago</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-surface-hover border border-border/50" />
            <span>Not done</span>
            <div className={cn("w-3 h-3 rounded-sm ml-2", fillColor)} />
            <span>Done</span>
          </div>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}
