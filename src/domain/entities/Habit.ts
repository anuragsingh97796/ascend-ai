// Domain Entity: Habit

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly";
export type HabitColor = "purple" | "cyan" | "emerald" | "amber" | "rose" | "indigo";

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
