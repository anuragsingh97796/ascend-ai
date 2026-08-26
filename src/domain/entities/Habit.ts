// Domain Entity: Habit

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly";
export type HabitColor =
  "purple" | "cyan" | "emerald" | "amber" | "rose" | "indigo";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: HabitColor;
  frequency: HabitFrequency;
  status?: HabitStatus;
  startDate?: string;
  reminderTime?: string;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  createdAt: string;
}


export type HabitStatus = "active" | "paused" | "archived";

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0-100 percentage
  completedDates: string[]; // sorted YYYY-MM-DD strings
  completedToday: boolean;
}

export interface CreateHabitPayload {
  name: string;
  description?: string;
  icon: string;
  color: HabitColor;
  frequency: HabitFrequency;
  status?: HabitStatus;
  startDate: string;
}

export interface UpdateHabitPayload {
  name?: string;
  description?: string;
  icon?: string;
  color?: HabitColor;
  frequency?: HabitFrequency;
  status?: HabitStatus;
}
