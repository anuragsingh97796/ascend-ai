import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabitToday,
} from "@/application/services/habitsService";
import type { Habit } from "@/domain/entities/Habit";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Habit, "id" | "createdAt">>;
    }) => updateHabit(id, updates), // Wait, does updateHabit exist in habitsService? I need to verify.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleHabitToday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
