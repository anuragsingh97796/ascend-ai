/**
 * Ascend AI — Goals Store (Zustand)
 */

import { create } from "zustand";

import type { Goal, GoalStatus } from "@/domain/entities/Goal";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "@/application/services/goalsService";

interface GoalsState {
  goals: Goal[];
  filter: GoalStatus | "all";
  isLoading: boolean;
  error: string | null;
}

interface GoalsActions {
  fetchGoals: () => Promise<void>;
  addGoal: (
    goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">
  ) => Promise<void>;
  updateGoal: (
    id: string,
    updates: Partial<Omit<Goal, "id" | "createdAt">>
  ) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  setFilter: (filter: GoalStatus | "all") => void;
}

type GoalsStore = GoalsState & GoalsActions;

export const useGoalsStore = create<GoalsStore>()((set, get) => ({
  goals: [],
  filter: "all",
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await getGoals();
      set({ goals, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch goals",
        isLoading: false,
      });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      const newGoal = await addGoal(goal);
      set((state) => ({
        goals: [newGoal, ...state.goals],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to add goal",
        isLoading: false,
      });
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedGoal = await updateGoal(id, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update goal",
        isLoading: false,
      });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteGoal(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete goal",
        isLoading: false,
      });
    }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;

    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            completed: !m.completed,
            completedAt: !m.completed ? new Date().toISOString() : undefined,
          }
        : m
    );

    await get().updateGoal(goalId, { milestones });
  },

  setFilter: (filter) => set({ filter }),
}));

export const useGoals = () => useGoalsStore((s) => s.goals);
export const useGoalsFilter = () => useGoalsStore((s) => s.filter);
