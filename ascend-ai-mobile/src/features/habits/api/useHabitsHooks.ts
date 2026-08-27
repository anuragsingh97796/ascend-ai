import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitApi } from './habitApi';
import { CreateHabitPayload, UpdateHabitPayload } from '../domain/habit.types';

export const HABIT_QUERY_KEYS = {
  all: ['habits'] as const,
  detail: (id: string) => ['habits', id] as const,
};

export const useHabits = () => {
  return useQuery({
    queryKey: HABIT_QUERY_KEYS.all,
    queryFn: habitApi.getHabits,
  });
};

export const useHabit = (id: string) => {
  return useQuery({
    queryKey: HABIT_QUERY_KEYS.detail(id),
    queryFn: () => habitApi.getHabit(id),
    enabled: !!id,
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHabitPayload) => habitApi.createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHabitPayload }) =>
      habitApi.updateHabit(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitApi.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
    },
  });
};

export const useCheckInHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitApi.checkIn(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.detail(id) });
    },
  });
};

export const useUndoCheckInHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitApi.undoCheckIn(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.detail(id) });
    },
  });
};
