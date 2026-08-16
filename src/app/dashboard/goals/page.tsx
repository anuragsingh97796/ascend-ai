"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
} from "@/application/hooks/useGoalsHooks";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/presentation/ui/modal";
import { Input } from "@/presentation/ui/input";
import { Textarea } from "@/presentation/ui/textarea";
import type { GoalCategory, GoalStatus } from "@/domain/entities/Goal";

export default function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();
  const { mutateAsync: addGoal } = useCreateGoal();
  const { mutateAsync: updateGoal } = useUpdateGoal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("health");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState<
    { id: string; title: string; completed: boolean }[]
  >([{ id: "1", title: "", completed: false }]);
  const [error, setError] = useState("");

  const handleToggle = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            completed: !m.completed,
            completedAt: !m.completed ? new Date().toISOString() : undefined,
          }
        : m
    );
    updateGoal({ id: goalId, updates: { milestones: updatedMilestones } });
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now().toString(), title: "", completed: false },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleMilestoneChange = (id: string, value: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, title: value } : m))
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("health");
    setStatus("active");
    setTargetDate("");
    setMilestones([{ id: "1", title: "", completed: false }]);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const validMilestones = milestones.filter((m) => m.title.trim() !== "");
    if (validMilestones.length === 0) {
      setError("At least one milestone is required");
      return;
    }

    try {
      await addGoal({
        title,
        description,
        category,
        status,
        targetDate: targetDate || undefined,
        milestones: validMilestones.map((m) => ({
          id: m.id,
          title: m.title.trim(),
          completed: false,
        })),
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    }
  };

  const categories: GoalCategory[] = [
    "health",
    "career",
    "learning",
    "finance",
    "relationships",
    "mindfulness",
    "other",
  ];

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
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          New Goal
        </Button>
      </div>

      <div className="dashboard-grid">
        {isLoading && <div className="text-gray-400">Loading goals...</div>}
        {!isLoading && goals.length === 0 && (
          <div className="text-gray-400 col-span-full text-center py-12">
            No goals yet. Create your first goal to start your transformation
            journey.
          </div>
        )}
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

      <Modal
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsCreateOpen(open);
        }}
      >
        <ModalContent className="max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-[#333]">
          <ModalHeader>
            <ModalTitle className="text-white">Create New Goal</ModalTitle>
            <ModalDescription className="text-gray-400">
              Set a new long-term objective and define milestones to reach it.
            </ModalDescription>
          </ModalHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Run a Marathon"
                className="bg-[#111] border-[#333] text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is your motivation?"
                className="bg-[#111] border-[#333] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="flex h-10 w-full rounded-md border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GoalStatus)}
                  className="flex h-10 w-full rounded-md border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Target Date (Optional)
              </label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-[#111] border-[#333] text-white [color-scheme:dark]"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-200">
                  Milestones
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <Plus size={14} /> Add Milestone
                </button>
              </div>

              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    <div className="bg-[#222] text-xs w-6 h-6 flex items-center justify-center rounded-full text-gray-400">
                      {index + 1}
                    </div>
                    <Input
                      value={milestone.title}
                      onChange={(e) =>
                        handleMilestoneChange(milestone.id, e.target.value)
                      }
                      placeholder="Milestone description"
                      className="bg-[#111] border-[#333] text-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </PageTransition>
  );
}
