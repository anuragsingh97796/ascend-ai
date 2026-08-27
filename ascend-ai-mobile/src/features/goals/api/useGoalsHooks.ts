import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalApi } from './goalApi';
import { CreateGoalPayload, UpdateGoalPayload } from '../domain/goal.types';

export const GOAL_QUERY_KEYS = {
  all: ['goals'] as const,
  detail: (id: string) => ['goals', id] as const,
};

export const useGoals = () => {
  return useQuery({
    queryKey: GOAL_QUERY_KEYS.all,
    queryFn: goalApi.getGoals,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(id),
    queryFn: () => goalApi.getGoal(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalPayload) => goalApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.all });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalPayload }) =>
      goalApi.updateGoal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.all });
    },
  });
};
