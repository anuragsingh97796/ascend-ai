import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from './journalApi';
import { CreateJournalPayload, UpdateJournalPayload } from '@shared/types/domain/Journal';

export const JOURNAL_QUERY_KEYS = {
  all: ['journals'] as const,
  detail: (id: string) => ['journals', id] as const,
};

export const useJournals = () => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.all,
    queryFn: journalApi.getJournalEntries,
  });
};

export const useJournal = (id: string) => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.detail(id),
    queryFn: () => journalApi.getJournalEntry(id),
    enabled: !!id,
  });
};

export const useCreateJournal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalPayload) => journalApi.createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
    },
  });
};

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJournalPayload }) =>
      journalApi.updateJournalEntry(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteJournal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalApi.deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
    },
  });
};
