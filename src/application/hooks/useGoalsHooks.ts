import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, addGoal, updateGoal, deleteGoal } from "@/application/services/goalsService";
import type { Goal } from "@/domain/entities/Goal";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Goal, "id" | "createdAt">> }) =>
      updateGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
