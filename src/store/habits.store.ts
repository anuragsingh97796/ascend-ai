/**
 * Ascend AI — Habits Store (Zustand)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly";
export type HabitColor =
  "brand" | "cyan" | "emerald" | "amber" | "rose" | "indigo";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: HabitColor;
  frequency: HabitFrequency;
  reminderTime?: string;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  createdAt: string;
}

interface HabitsState {
  habits: Habit[];
}

interface HabitsActions {
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "currentStreak" | "longestStreak" | "completedDates" | "createdAt"
    >
  ) => void;
  updateHabit: (
    id: string,
    updates: Partial<Omit<Habit, "id" | "createdAt">>
  ) => void;
  deleteHabit: (id: string) => void;
  checkIn: (id: string) => void;
  undoCheckIn: (id: string) => void;
}

type HabitsStore = HabitsState & HabitsActions;

const toDateStr = (date: Date = new Date()) => date.toISOString().split("T")[0];

const calcStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = toDateStr();
  let streak = 0;
  let check = today;

  for (const d of sorted) {
    if (d === check) {
      streak++;
      const prev = new Date(check);
      prev.setDate(prev.getDate() - 1);
      check = toDateStr(prev);
    } else break;
  }
  return streak;
};

const SEED_HABITS: Habit[] = [
  {
    id: "h1",
    name: "Morning Meditation",
    description: "10 minutes of mindful breathing to start the day",
    icon: "🧘",
    color: "brand",
    frequency: "daily",
    reminderTime: "07:00",
    currentStreak: 21,
    longestStreak: 30,
    completedDates: Array.from({ length: 21 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return toDateStr(d);
    }),
    createdAt: "2026-06-01T00:00:00Z",
  },
];

export const useHabitsStore = create<HabitsStore>()(
  persist(
    (set) => ({
      habits: SEED_HABITS,
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            {
              ...habit,
              id: `habit_${Date.now()}`,
              currentStreak: 0,
              longestStreak: 0,
              completedDates: [],
              createdAt: new Date().toISOString(),
            },
            ...state.habits,
          ],
        })),
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),
      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      checkIn: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const today = toDateStr();
            if (h.completedDates.includes(today)) return h;
            const completedDates = [today, ...h.completedDates];
            const currentStreak = calcStreak(completedDates);
            return {
              ...h,
              completedDates,
              currentStreak,
              longestStreak: Math.max(h.longestStreak, currentStreak),
            };
          }),
        })),
      undoCheckIn: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const today = toDateStr();
            const completedDates = h.completedDates.filter((d) => d !== today);
            return {
              ...h,
              completedDates,
              currentStreak: calcStreak(completedDates),
            };
          }),
        })),
    }),
    {
      name: "ascend-ai:habits",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
    }
  )
);

export const useHabits = () => useHabitsStore((s) => s.habits);
export const useTodaysHabits = () =>
  useHabitsStore((s) => {
    const today = toDateStr();
    return s.habits.map((h) => ({
      ...h,
      completedToday: h.completedDates.includes(today),
    }));
  });
