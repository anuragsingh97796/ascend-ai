import { apiClient } from '@shared/services/apiClient';
import { API_ENDPOINTS } from '@core/constants/api';
import {
  JournalEntry,
  CreateJournalPayload,
  UpdateJournalPayload,
} from '@shared/types/domain/Journal';
import { ApiResponse } from '@shared/types/api.types';

export const journalApi = {
  getJournalEntries: async (): Promise<JournalEntry[]> => {
    const response = await apiClient.get<ApiResponse<JournalEntry[]>>(API_ENDPOINTS.JOURNAL_LIST);
    if (!response.data.success)
      throw new Error(response.data.error || 'Failed to fetch journal entries');
    return response.data.data || [];
  },

  getJournalEntry: async (id: string): Promise<JournalEntry> => {
    const response = await apiClient.get<ApiResponse<JournalEntry>>(
      API_ENDPOINTS.JOURNAL_DETAIL(id),
    );
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to fetch journal entry');
    return response.data.data;
  },

  createJournalEntry: async (data: CreateJournalPayload): Promise<JournalEntry> => {
    const response = await apiClient.post<ApiResponse<JournalEntry>>(
      API_ENDPOINTS.JOURNAL_LIST,
      data,
    );
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to create journal entry');
    return response.data.data;
  },

  updateJournalEntry: async (id: string, data: UpdateJournalPayload): Promise<JournalEntry> => {
    const response = await apiClient.put<ApiResponse<JournalEntry>>(
      API_ENDPOINTS.JOURNAL_DETAIL(id),
      data,
    );
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to update journal entry');
    return response.data.data;
  },

  deleteJournalEntry: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.JOURNAL_DETAIL(id));
    if (!response.data.success)
      throw new Error(response.data.error || 'Failed to delete journal entry');
  },
};
