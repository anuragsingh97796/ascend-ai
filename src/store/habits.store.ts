/**
 * Ascend AI — Habits Store (Zustand)
 */

import { create } from "zustand";

import type { Habit } from "@/domain/entities/Habit";
import {
  getHabits,
  addHabit,
  deleteHabit,
  toggleHabitToday,
} from "@/application/services/habitsService";

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
}

interface HabitsActions {
  fetchHabits: () => Promise<void>;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "currentStreak" | "longestStreak" | "completedDates" | "createdAt"
    >
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
}

type HabitsStore = HabitsState & HabitsActions;

const toDateStr = (date: Date = new Date()) => date.toISOString().split("T")[0];

export const useHabitsStore = create<HabitsStore>()((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await getHabits();
      set({ habits, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch habits",
        isLoading: false,
      });
    }
  },

  addHabit: async (habit) => {
    set({ isLoading: true, error: null });
    try {
      const newHabit = await addHabit(habit);
      set((state) => ({
        habits: [newHabit, ...state.habits],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to add habit",
        isLoading: false,
      });
    }
  },

  deleteHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteHabit(id);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete habit",
        isLoading: false,
      });
    }
  },

  toggleHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;

    // Optimistic UI update could go here
    try {
      const updatedHabit = await toggleHabitToday(habit);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
      }));
    } catch (err) {
      console.error("Failed to toggle habit check-in", err);
    }
  },
}));

export const useHabits = () => useHabitsStore((s) => s.habits);
export const useTodaysHabits = () =>
  useHabitsStore((s) => {
    const today = toDateStr();
    return s.habits.map((h) => ({
      ...h,
      completedToday: h.completedDates?.includes(today) || false,
    }));
  });
