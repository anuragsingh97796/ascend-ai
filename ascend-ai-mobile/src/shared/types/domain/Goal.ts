// Domain Entity: Goal

export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';
export type GoalCategory =
  | 'health'
  | 'career'
  | 'learning'
  | 'finance'
  | 'relationships'
  | 'mindfulness'
  | 'creativity'
  | 'other';

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
  priority?: GoalPriority;
  status: GoalStatus;
  progress: number;
  targetDate?: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export type GoalPriority = 'low' | 'medium' | 'high';

export interface CreateGoalPayload {
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  targetDate?: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  status?: GoalStatus;
  progress?: number;
  targetDate?: string;
}
