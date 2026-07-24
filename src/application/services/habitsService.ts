// Application Service: Habits (localStorage)

import type {
  Habit,
  HabitColor,
  HabitFrequency,
} from "@/domain/entities/Habit";

const KEY = "ascend:habits";

const today = () => new Date().toISOString().split("T")[0];

const SEED: Habit[] = [
  {
    id: "h1",
    name: "Morning Meditation",
    description: "10 minutes of mindfulness",
    icon: "🧘",
    color: "purple",
    frequency: "daily",
    currentStreak: 12,
    longestStreak: 21,
    completedDates: Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }),
    createdAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "h2",
    name: "Read 30 Pages",
    description: "Non-fiction reading habit",
    icon: "📚",
    color: "cyan",
    frequency: "daily",
    currentStreak: 5,
    longestStreak: 14,
    completedDates: Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }),
    createdAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "h3",
    name: "Evening Run",
    description: "3km minimum",
    icon: "🏃",
    color: "emerald",
    frequency: "weekdays",
    currentStreak: 3,
    longestStreak: 8,
    completedDates: Array.from({ length: 3 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }),
    createdAt: "2026-07-05T00:00:00Z",
  },
  {
    id: "h4",
    name: "No Social Media",
    description: "Until 6pm each day",
    icon: "📵",
    color: "amber",
    frequency: "daily",
    currentStreak: 0,
    longestStreak: 5,
    completedDates: [],
    createdAt: "2026-07-10T00:00:00Z",
  },
];

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEY, JSON.stringify(habits));
}

export function addHabit(
  habit: Omit<
    Habit,
    "id" | "createdAt" | "currentStreak" | "longestStreak" | "completedDates"
  >
): Habit[] {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habit,
    id: `h_${Date.now()}`,
    currentStreak: 0,
    longestStreak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
  };
  const updated = [newHabit, ...habits];
  saveHabits(updated);
  return updated;
}

export function deleteHabit(id: string): Habit[] {
  const habits = getHabits().filter((h) => h.id !== id);
  saveHabits(habits);
  return habits;
}

export function toggleHabitToday(id: string): Habit[] {
  const todayStr = today();
  const habits = getHabits().map((h) => {
    if (h.id !== id) return h;
    const alreadyDone = h.completedDates.includes(todayStr);
    const completedDates = alreadyDone
      ? h.completedDates.filter((d) => d !== todayStr)
      : [...h.completedDates, todayStr];
    const currentStreak = calcStreak(completedDates);
    const longestStreak = Math.max(h.longestStreak, currentStreak);
    return { ...h, completedDates, currentStreak, longestStreak };
  });
  saveHabits(habits);
  return habits;
}

function calcStreak(dates: string[]): number {
  const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
  let streak = 0;
  const check = new Date();
  for (const d of sorted) {
    const expected = check.toISOString().split("T")[0];
    if (d === expected) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (d < expected) break;
  }
  return streak;
}

export function isCompletedToday(habit: Habit): boolean {
  return habit.completedDates.includes(today());
}

export type { HabitColor, HabitFrequency };
