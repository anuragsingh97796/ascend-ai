// Application Store: Goals (localStorage)

import type { Goal, GoalStatus, Milestone } from "@/domain/entities/Goal";

const KEY = "ascend:goals";

const SEED: Goal[] = [
  {
    id: "g1",
    title: "Master TypeScript",
    description: "Become proficient in advanced TypeScript patterns.",
    category: "learning",
    status: "active",
    progress: 60,
    targetDate: "2026-09-01",
    milestones: [
      {
        id: "m1",
        title: "Complete basics",
        completed: true,
        completedAt: "2026-07-01",
      },
      {
        id: "m2",
        title: "Advanced types",
        completed: true,
        completedAt: "2026-07-10",
      },
      { id: "m3", title: "Build a project", completed: false },
    ],
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-07-10T14:00:00Z",
  },
  {
    id: "g2",
    title: "Run 5K under 25 minutes",
    description: "Train 3x per week to improve pace.",
    category: "health",
    status: "active",
    progress: 40,
    targetDate: "2026-08-15",
    milestones: [
      {
        id: "m4",
        title: "Run 5K non-stop",
        completed: true,
        completedAt: "2026-06-20",
      },
      { id: "m5", title: "8-week program", completed: false },
      { id: "m6", title: "Sub-28 min", completed: false },
    ],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "g3",
    title: "Save $10,000 Emergency Fund",
    description: "Automate savings and cut subscriptions.",
    category: "finance",
    status: "active",
    progress: 75,
    targetDate: "2026-12-31",
    milestones: [
      {
        id: "m7",
        title: "Save $2,500",
        completed: true,
        completedAt: "2026-04-01",
      },
      {
        id: "m8",
        title: "Reach $5,000",
        completed: true,
        completedAt: "2026-06-15",
      },
      {
        id: "m9",
        title: "Reach $7,500",
        completed: true,
        completedAt: "2026-07-10",
      },
      { id: "m10", title: "Complete $10,000", completed: false },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-07-10T00:00:00Z",
  },
];

function calcProgress(milestones: Milestone[]): number {
  if (!milestones.length) return 0;
  return Math.round(
    (milestones.filter((m) => m.completed).length / milestones.length) * 100
  );
}

export function getGoals(): Goal[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

function saveGoals(goals: Goal[]): void {
  localStorage.setItem(KEY, JSON.stringify(goals));
}

export function addGoal(
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">
): Goal[] {
  const goals = getGoals();
  const newGoal: Goal = {
    ...goal,
    id: `g_${Date.now()}`,
    progress: calcProgress(goal.milestones),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [newGoal, ...goals];
  saveGoals(updated);
  return updated;
}

export function updateGoal(
  id: string,
  updates: Partial<Omit<Goal, "id" | "createdAt">>
): Goal[] {
  const goals = getGoals().map((g) =>
    g.id === id
      ? {
          ...g,
          ...updates,
          progress: updates.milestones
            ? calcProgress(updates.milestones)
            : g.progress,
          updatedAt: new Date().toISOString(),
        }
      : g
  );
  saveGoals(goals);
  return goals;
}

export function deleteGoal(id: string): Goal[] {
  const goals = getGoals().filter((g) => g.id !== id);
  saveGoals(goals);
  return goals;
}

export function toggleMilestone(goalId: string, milestoneId: string): Goal[] {
  const goals = getGoals().map((g) => {
    if (g.id !== goalId) return g;
    const milestones = g.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            completed: !m.completed,
            completedAt: !m.completed ? new Date().toISOString() : undefined,
          }
        : m
    );
    return {
      ...g,
      milestones,
      progress: calcProgress(milestones),
      updatedAt: new Date().toISOString(),
    };
  });
  saveGoals(goals);
  return goals;
}

export type { GoalStatus };
