/**
 * Ascend AI — Goals Store (Zustand)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GoalStatus = "active" | "completed" | "paused" | "archived";
export type GoalCategory =
  | "health"
  | "career"
  | "learning"
  | "finance"
  | "relationships"
  | "mindfulness"
  | "creativity"
  | "other";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  progress: number;
  targetDate?: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

interface GoalsState {
  goals: Goal[];
  filter: GoalStatus | "all";
}

interface GoalsActions {
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  setFilter: (filter: GoalStatus | "all") => void;
}

type GoalsStore = GoalsState & GoalsActions;

const calcProgress = (milestones: Milestone[], manualProgress?: number): number => {
  if (milestones.length === 0) return manualProgress ?? 0;
  const done = milestones.filter((m) => m.completed).length;
  return Math.round((done / milestones.length) * 100);
};

const SEED_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Complete TypeScript Mastery Course",
    description: "Become proficient in TypeScript including advanced types, generics, and patterns.",
    category: "learning",
    status: "active",
    progress: 60,
    targetDate: "2026-09-01",
    milestones: [
      { id: "m1", title: "Finish basics module", completed: true, completedAt: "2026-07-01" },
      { id: "m2", title: "Complete advanced types", completed: true, completedAt: "2026-07-10" },
      { id: "m3", title: "Build a project with TS", completed: false },
    ],
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-07-10T14:00:00Z",
  },
  {
    id: "g2",
    title: "Run a 5K in under 25 minutes",
    description: "Train consistently 3x per week to improve my running pace and endurance.",
    category: "health",
    status: "active",
    progress: 40,
    targetDate: "2026-08-15",
    milestones: [
      { id: "m4", title: "Run 5K without stopping", completed: true, completedAt: "2026-06-20" },
      { id: "m5", title: "Complete 8-week training", completed: false },
      { id: "m6", title: "Sub-28 minute 5K", completed: false },
    ],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-05T10:00:00Z",
  },
];

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set) => ({
      goals: SEED_GOALS,
      filter: "all",
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            {
              ...goal,
              id: `goal_${Date.now()}`,
              progress: calcProgress(goal.milestones),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.goals,
          ],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                  progress: updates.milestones ? calcProgress(updates.milestones) : g.progress,
                  updatedAt: new Date().toISOString(),
                }
              : g
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const milestones = g.milestones.map((m) =>
              m.id === milestoneId
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                : m
            );
            return { ...g, milestones, progress: calcProgress(milestones), updatedAt: new Date().toISOString() };
          }),
        })),
      setFilter: (filter) => set({ filter }),
    }),
    {
      name: "ascend-ai:goals",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
    }
  )
);

export const useGoals = () => useGoalsStore((s) => s.goals);
export const useGoalsFilter = () => useGoalsStore((s) => s.filter);
