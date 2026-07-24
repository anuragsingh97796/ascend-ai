"use client";

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { getGoals } from "@/application/services/goalsService";
import { getHabits, isCompletedToday } from "@/application/services/habitsService";
import { getEntries } from "@/application/services/journalService";
import { Target, Flame, BookOpen, BarChart3, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    setGoals(getGoals());
    setHabits(getHabits());
    setEntries(getEntries());
  }, []);

  const activeGoals = goals.filter((g) => g.status === "active");
  const avgProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;

  const longestStreak = Math.max(0, ...habits.map((h) => h.currentStreak || 0));
  const habitsCompletedToday = habits.filter((h) => isCompletedToday(h)).length;
  const habitRate = habits.length ? Math.round((habitsCompletedToday / habits.length) * 100) : 0;
  const totalWords = entries.reduce((s, e) => s + (e.wordCount || 0), 0);

  return (
    <PageTransition>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Analytics Module</h1>
          <p style={{ color: "var(--text-secondary)" }}>Performance metrics, habit heatmaps, and psychological growth trends.</p>
        </div>

        {/* Circular Progress & Key Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          <GlassCard style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--brand-400)", marginBottom: 4 }}>{avgProgress}%</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Avg Goal Progress</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{activeGoals.length} Active Goals</div>
          </GlassCard>

          <GlassCard style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent-emerald)", marginBottom: 4 }}>{habitRate}%</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Daily Consistency</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{habitsCompletedToday}/{habits.length} Habits Done</div>
          </GlassCard>

          <GlassCard style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#f59e0b", marginBottom: 4 }}>{longestStreak}d</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Best Habit Streak</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>Top active streak</div>
          </GlassCard>

          <GlassCard style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#06b6d4", marginBottom: 4 }}>{entries.length}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Journal Reflections</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{totalWords.toLocaleString()} Words</div>
          </GlassCard>
        </div>

        {/* Heatmap & Weekly Overview */}
        <GlassCard>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>35-Day Consistency Heatmap</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 32,
                  borderRadius: 6,
                  background: i % 3 === 0 ? "rgba(139,92,246,0.5)" : i % 2 === 0 ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
