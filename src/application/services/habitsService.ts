import type {
  Habit,
  HabitColor,
  HabitFrequency,
} from "@/domain/entities/Habit";
import { apiClient } from "@/infrastructure/api/apiClient";

const today = () => new Date().toISOString().split("T")[0];

export async function getHabits(): Promise<Habit[]> {
  const res = await apiClient.get("/habits");
  return res.data?.data || [];
}

export async function addHabit(
  habit: Omit<
    Habit,
    "id" | "createdAt" | "currentStreak" | "longestStreak" | "completedDates"
  >
): Promise<Habit> {
  const payload = {
    ...habit,
    currentStreak: 0,
    longestStreak: 0,
    completedDates: [],
  };
  const res = await apiClient.post("/habits", payload);
  return res.data?.data;
}

export async function deleteHabit(id: string): Promise<string> {
  await apiClient.delete(`/habits/${id}`);
  return id;
}

export async function toggleHabitToday(habit: Habit): Promise<Habit> {
  const todayStr = today();
  const alreadyDone = habit.completedDates.includes(todayStr);

  const completedDates = alreadyDone
    ? habit.completedDates.filter((d) => d !== todayStr)
    : [...habit.completedDates, todayStr];

  const currentStreak = calcStreak(completedDates);
  const longestStreak = Math.max(habit.longestStreak, currentStreak);

  const updates = {
    completedDates,
    currentStreak,
    longestStreak,
  };

  const res = await apiClient.put(`/habits/${habit.id}`, updates);
  return res.data?.data;
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
  return habit.completedDates?.includes(today()) || false;
}

export type { HabitColor, HabitFrequency };
