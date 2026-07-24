// Domain Entity: Goal

export type GoalStatus = "active" | "completed" | "paused";
export type GoalCategory =
  | "health"
  | "career"
  | "learning"
  | "finance"
  | "relationships"
  | "mindfulness"
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
