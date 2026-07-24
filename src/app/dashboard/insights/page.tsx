"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { getGoals } from "@/application/services/goalsService";
import { getHabits } from "@/application/services/habitsService";
import { getEntries } from "@/application/services/journalService";
import type { Goal } from "@/domain/entities/Goal";
import type { Habit } from "@/domain/entities/Habit";
import type { JournalEntry } from "@/domain/entities/Journal";
import {
  TrendingUp,
  Flame,
  Brain,
  Lightbulb,
  Trophy,
  Activity,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";

export default function InsightsPage() {
  const [goals] = useState<Goal[]>(() => getGoals());
  const [habits] = useState<Habit[]>(() => getHabits());
  const [entries] = useState<JournalEntry[]>(() => getEntries());

  const completedGoals = goals.filter((g) => g.status === "completed");
  const longestStreak = Math.max(0, ...habits.map((h) => h.currentStreak || 0));
  const totalWords = entries.reduce((s, e) => s + (e.wordCount || 0), 0);

  return (
    <PageTransition>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            AI Insights Hub
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Comprehensive weekly evaluation, risk diagnostics, and cognitive
            recommendations.
          </p>
        </div>

        {/* Hero AI Report */}
        <GlassCard
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.05))",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <Brain size={32} color="var(--brand-400)" />
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
              Weekly AI Performance Synthesis
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            &quot;Your focus stability is up 18% compared to last week. You are
            maintaining strong habit momentum with high journaling activity.
            Here is your synthesized breakdown.&quot;
          </p>
        </GlassCard>

        {/* 7 Insight Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <TrendingUp size={20} color="var(--brand-400)" />
              <span className="badge">Analysis</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Weekly Analysis
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Consistently active on core habits. Peak performance recorded
              between Tuesday and Thursday morning.
            </p>
          </GlassCard>

          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Activity size={20} color="#06b6d4" />
              <span className="badge">88/100</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Productivity Report
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Goal completion efficiency is high. 84% of tasks completed within
              estimated timeframes.
            </p>
          </GlassCard>

          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Flame size={20} color="#10b981" />
              <span className="badge">Healthy</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Health Summary
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Physical check-in habits maintain a strong {longestStreak}-day
              streak. Energy levels remain steady.
            </p>
          </GlassCard>

          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <GraduationCap size={20} color="#6366f1" />
              <span className="badge">{totalWords} words</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Learning Summary
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Journal reflection depth has increased. Extracted key learnings
              regarding workflow optimization.
            </p>
          </GlassCard>

          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Lightbulb size={20} color="#f59e0b" />
              <span className="badge">Action Item</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Suggested Improvements
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Consider shifting evening reflection 30 minutes earlier to improve
              sleep consistency.
            </p>
          </GlassCard>

          <GlassCard
            style={{
              border: "1px solid rgba(244,63,94,0.3)",
              background: "rgba(244,63,94,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <ShieldAlert size={20} color="#f43f5e" />
              <span
                className="badge"
                style={{ background: "rgba(244,63,94,0.2)", color: "#f43f5e" }}
              >
                Low Risk
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Risk Alerts
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Slight drop in weekend habit tracking detected. Recommend setting
              micro-reminders for Sunday.
            </p>
          </GlassCard>
        </div>

        {/* Achievement Summary */}
        <GlassCard
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Trophy size={32} color="#f59e0b" />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                Achievement Summary
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                You have completed {completedGoals.length} major goals and
                logged over {totalWords} words this cycle.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
