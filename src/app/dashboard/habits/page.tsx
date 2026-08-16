"use client";

import React from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import { useHabits, useToggleHabit } from "@/application/hooks/useHabitsHooks";
import { isCompletedToday } from "@/application/services/habitsService";
import { Check, Flame } from "lucide-react";

export default function HabitsPage() {
  const { data: habits = [], isLoading } = useHabits();
  const { mutateAsync: toggleHabit } = useToggleHabit();

  const handleCheckIn = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    await toggleHabit(habit);
  };

  return (
    <PageTransition>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Habits
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Build consistency and track your daily routines.
          </p>
        </div>
        <Button variant="primary">New Habit</Button>
      </div>

      <div className="dashboard-grid">
        {isLoading && <div className="text-gray-400">Loading habits...</div>}
        {!isLoading && habits.length === 0 && (
          <div className="text-gray-400 col-span-full text-center py-12">
            No habits yet. Start tracking your daily routines.
          </div>
        )}
        {habits.map((habit, i) => {
          const completed = isCompletedToday(habit);
          return (
            <GlassCard key={habit.id} delay={i * 0.1}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28 }}>{habit.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                      {habit.name}
                    </h3>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {habit.frequency}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--accent-amber)",
                  }}
                >
                  <Flame
                    size={16}
                    color={
                      habit.currentStreak > 0
                        ? "#f59e0b"
                        : "var(--text-disabled)"
                    }
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color:
                        habit.currentStreak > 0
                          ? "#f59e0b"
                          : "var(--text-disabled)",
                    }}
                  >
                    {habit.currentStreak}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCheckIn(habit.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: completed
                    ? "1px solid var(--success)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: completed
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(255,255,255,0.03)",
                  color: completed ? "var(--success)" : "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                {completed ? <Check size={16} /> : null}
                {completed ? "Completed Today" : "Check In"}
              </button>
            </GlassCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
