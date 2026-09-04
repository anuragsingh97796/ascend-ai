import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "@/application/services/goalsService";
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
    onSuccess: (newGoal) => {
      queryClient.setQueryData<Goal[]>(["goals"], (old) =>
        old ? [newGoal, ...old] : [newGoal]
      );
      void queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Goal, "id" | "createdAt">>;
    }) => updateGoal(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["goals"] });
      const previousGoals = queryClient.getQueryData<Goal[]>(["goals"]);
      queryClient.setQueryData<Goal[]>(["goals"], (old) =>
        old
          ? old.map((g) =>
              g.id === id
                ? { ...g, ...updates, updatedAt: new Date().toISOString() }
                : g
            )
          : old
      );
      return { previousGoals };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals"], context.previousGoals);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["goals"] });
      const previousGoals = queryClient.getQueryData<Goal[]>(["goals"]);
      queryClient.setQueryData<Goal[]>(["goals"], (old) =>
        old ? old.filter((g) => g.id !== id) : old
      );
      return { previousGoals };
    },
    onError: (_err, _id, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals"], context.previousGoals);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
