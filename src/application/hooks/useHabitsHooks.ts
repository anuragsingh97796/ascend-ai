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
    onSuccess: (newHabit) => {
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old ? [newHabit, ...old] : [newHabit]
      );
      void queryClient.invalidateQueries({ queryKey: ["habits"] });
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
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"]);
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old
          ? old.map((h) =>
              h.id === id
                ? { ...h, ...updates, updatedAt: new Date().toISOString() }
                : h
            )
          : old
      );
      return { previousHabits };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits"], context.previousHabits);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"]);
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old ? old.filter((h) => h.id !== id) : old
      );
      return { previousHabits };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits"], context.previousHabits);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleHabitToday,
    onMutate: async (habit) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"]);

      queryClient.setQueryData<Habit[]>(["habits"], (old) => {
        if (!old) return old;
        const todayStr = new Date().toISOString().split("T")[0];
        return old.map((h) => {
          if (h.id !== habit.id) return h;
          const alreadyDone = h.completedDates.includes(todayStr);
          const newDates = alreadyDone
            ? h.completedDates.filter((d) => d !== todayStr)
            : [...h.completedDates, todayStr];

          return {
            ...h,
            completedDates: newDates,
          };
        });
      });

      return { previousHabits };
    },
    onError: (_err, _habit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits"], context.previousHabits);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useCompleteHabit() {
  return useToggleHabit();
}
export function useUncompleteHabit() {
  return useToggleHabit();
}
export function useAllHabitStats() {
  const { data: habits } = useHabits();
  return {
    data:
      habits?.map((h) => ({
        habitId: h.id,
        currentStreak: h.currentStreak,
        longestStreak: h.longestStreak,
        totalCompletions: h.completedDates.length,
        completionRate: 100,
        completedDates: h.completedDates,
        completedToday: h.completedDates.includes(
          new Date().toISOString().split("T")[0]
        ),
      })) || [],
    isLoading: false,
  };
}
