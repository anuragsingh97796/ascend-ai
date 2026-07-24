"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import { getGoals, toggleMilestone } from "@/application/services/goalsService";
import type { Goal } from "@/domain/entities/Goal";
import { CheckCircle2, Circle } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => getGoals());

  const handleToggle = (goalId: string, milestoneId: string) => {
    const updated = toggleMilestone(goalId, milestoneId);
    setGoals(updated);
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
            Goals
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Track and manage your long-term objectives.
          </p>
        </div>
        <Button variant="primary">New Goal</Button>
      </div>

      <div className="dashboard-grid">
        {goals.map((goal, i) => (
          <GlassCard key={goal.id} delay={i * 0.1}>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{goal.title}</h3>
                <span
                  className="badge"
                  style={{
                    background: `var(--cat-${goal.category})`,
                    color: "#fff",
                    opacity: 0.8,
                  }}
                >
                  {goal.category}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {goal.description}
              </p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span>Progress</span>
                <span style={{ fontWeight: 600 }}>{goal.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {goal.milestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleToggle(goal.id, m.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: m.completed
                      ? "var(--text-secondary)"
                      : "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {m.completed ? (
                    <CheckCircle2 size={16} color="var(--success)" />
                  ) : (
                    <Circle size={16} color="var(--text-tertiary)" />
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      textDecoration: m.completed ? "line-through" : "none",
                    }}
                  >
                    {m.title}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </PageTransition>
  );
}
