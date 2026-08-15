import type { Goal, GoalStatus, Milestone } from "@/domain/entities/Goal";
import { apiClient } from "@/infrastructure/api/apiClient";

export async function getGoals(): Promise<Goal[]> {
  const res = await apiClient.get("/goals");
  return res.data?.data || [];
}

export async function addGoal(
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">
): Promise<Goal> {
  const payload = {
    ...goal,
    progress: calcProgress(goal.milestones),
  };
  const res = await apiClient.post("/goals", payload);
  return res.data?.data;
}

export async function updateGoal(
  id: string,
  updates: Partial<Omit<Goal, "id" | "createdAt">>
): Promise<Goal> {
  if (updates.milestones) {
    updates.progress = calcProgress(updates.milestones);
  }
  const res = await apiClient.put(`/goals/${id}`, updates);
  return res.data?.data;
}

export async function deleteGoal(id: string): Promise<string> {
  await apiClient.delete(`/goals/${id}`);
  return id;
}

function calcProgress(milestones: Milestone[]): number {
  if (!milestones || milestones.length === 0) return 0;
  return Math.round(
    (milestones.filter((m) => m.completed).length / milestones.length) * 100
  );
}

export type { GoalStatus };
