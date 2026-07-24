"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import { getGoals } from "@/application/services/goalsService";
import {
  getHabits,
  toggleHabitToday,
  isCompletedToday,
} from "@/application/services/habitsService";
import { getEntries } from "@/application/services/journalService";
import { getStoredAuth } from "@/application/services/authService";
import type { Goal } from "@/domain/entities/Goal";
import type { Habit } from "@/domain/entities/Habit";
import type { JournalEntry } from "@/domain/entities/Journal";
import {
  Target,
  Flame,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const DAILY_QUOTES = [
  {
    quote:
      "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    quote:
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    quote: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
  },
];

export default function DashboardOverviewPage() {
  const [user] = useState<{ name: string } | null>(() => {
    const auth = getStoredAuth();
    return auth?.user || null;
  });
  const [goals] = useState<Goal[]>(() => getGoals());
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const [entries] = useState<JournalEntry[]>(() => getEntries());
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleHabitToggle = (habitId: string) => {
    const updated = toggleHabitToday(habitId);
    setHabits(updated);
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const avgGoalProgress = activeGoals.length
    ? Math.round(
        activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length
      )
    : 0;

  const habitsCompletedToday = habits.filter((h) => isCompletedToday(h)).length;
  const totalHabitsToday = habits.length;
  const habitCompletionRate = totalHabitsToday
    ? Math.round((habitsCompletedToday / totalHabitsToday) * 100)
    : 0;

  const productivityScore = Math.min(
    100,
    Math.round(
      avgGoalProgress * 0.4 +
        habitCompletionRate * 0.4 +
        Math.min(entries.length * 5, 20)
    )
  );
  const currentQuote = DAILY_QUOTES[quoteIndex];

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
        {/* Animated Banner / AI OS Greeting */}
        <GlassCard
          style={{
            padding: "32px",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(ellipse at top left, rgba(139,92,246,0.15), transparent 70%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "var(--brand-400)",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <Sparkles size={14} /> AI OS v3.0 Active
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
                Welcome back,{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #a78bfa, #6366f1, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {user?.name || "Ascender"}
                </span>{" "}
                👋
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 15,
                  maxWidth: 600,
                }}
              >
                Your neural co-pilot has calibrated today&apos;s optimal growth
                path based on your goals, habits, and recent reflections.
              </p>
            </div>

            {/* Productivity Score Ring */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: "var(--brand-400)",
                  }}
                >
                  {productivityScore}
                  <span style={{ fontSize: 16, color: "var(--text-tertiary)" }}>
                    /100
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--accent-emerald)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrendingUp size={12} /> Top 10% Performance
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Today's Mission & AI Recommendation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {/* Mission Checklist */}
          <GlassCard style={{ flex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(139,92,246,0.15)",
                    color: "var(--brand-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Compass size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                    Today&apos;s Mission
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    Priority check-ins to maintain momentum
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--brand-400)",
                  background: "rgba(139,92,246,0.1)",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {habitsCompletedToday}/{totalHabitsToday} Done
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {habits.slice(0, 4).map((h) => {
                const done = isCompletedToday(h);
                return (
                  <div
                    key={h.id}
                    onClick={() => handleHabitToggle(h.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: done
                        ? "rgba(16,185,129,0.06)"
                        : "rgba(255,255,255,0.02)",
                      border: done
                        ? "1px solid rgba(16,185,129,0.2)"
                        : "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span style={{ fontSize: 18 }}>{h.icon}</span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: done
                            ? "var(--text-secondary)"
                            : "var(--text-primary)",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {h.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      <Flame size={14} color="#f59e0b" />
                      <span>{h.currentStreak}d streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* AI Recommendation */}
          <GlassCard
            style={{
              background:
                "linear-gradient(180deg, rgba(139,92,246,0.12), transparent)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(139,92,246,0.2)",
                  color: "var(--brand-400)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lightbulb size={18} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--brand-400)",
                  textTransform: "uppercase",
                }}
              >
                AI Recommendation
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              High Focus Window Detected
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              &quot;Based on your recent habit check-ins and logs, your peak
              focus window is right now. Complete your hardest goal task today
              before 3 PM.&quot;
            </p>

            <Link href="/dashboard/coach" style={{ textDecoration: "none" }}>
              <Button
                variant="primary"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Brain size={16} /> Ask AI Coach
                </span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </GlassCard>
        </div>

        {/* Goal Cards & Daily Quote */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          <GlassCard style={{ flex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Target size={20} color="#06b6d4" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                  Goal Progress Cards
                </h3>
              </div>
              <Link
                href="/dashboard/goals"
                style={{
                  fontSize: 13,
                  color: "var(--brand-400)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View All →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {activeGoals.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  style={{
                    padding: "14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    <span>{g.title}</span>
                    <span style={{ color: "var(--brand-400)" }}>
                      {g.progress}%
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${g.progress}%`,
                        background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Daily Quote Card */}
          <GlassCard
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#f59e0b",
                    textTransform: "uppercase",
                  }}
                >
                  Quote of the Day
                </span>
                <button
                  onClick={() =>
                    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <blockquote
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                &quot;{currentQuote.quote}&quot;
              </blockquote>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: "right",
                  color: "var(--text-primary)",
                }}
              >
                — {currentQuote.author}
              </p>
            </div>

            <div
              style={{
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                textAlign: "center",
              }}
            >
              <Link
                href="/dashboard/journal"
                style={{
                  fontSize: 12,
                  color: "var(--brand-400)",
                  textDecoration: "none",
                }}
              >
                Reflect in Journal →
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
