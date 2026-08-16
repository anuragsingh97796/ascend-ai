import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntries, addEntry, updateEntry, deleteEntry } from "@/application/services/journalService";
import type { JournalEntry } from "@/domain/entities/Journal";

export function useJournalEntries() {
  return useQuery({
    queryKey: ["journal"],
    queryFn: getEntries,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">> }) =>
      updateEntry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}
