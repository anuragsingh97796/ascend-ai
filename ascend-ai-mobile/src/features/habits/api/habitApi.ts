import { apiClient } from '@shared/services/apiClient';
import { API_ENDPOINTS } from '@core/constants/api';
import { Habit, CreateHabitPayload, UpdateHabitPayload } from '../domain/habit.types';
import { ApiResponse } from '@shared/types/api.types';

export const habitApi = {
  getHabits: async (): Promise<Habit[]> => {
    const response = await apiClient.get<ApiResponse<Habit[]>>(API_ENDPOINTS.HABITS_LIST);
    if (!response.data.success) throw new Error(response.data.error || 'Failed to fetch habits');
    return response.data.data || [];
  },

  getHabit: async (id: string): Promise<Habit> => {
    const response = await apiClient.get<ApiResponse<Habit>>(API_ENDPOINTS.HABIT_DETAIL(id));
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to fetch habit');
    return response.data.data;
  },

  createHabit: async (data: CreateHabitPayload): Promise<Habit> => {
    const response = await apiClient.post<ApiResponse<Habit>>(API_ENDPOINTS.HABITS_LIST, data);
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to create habit');
    return response.data.data;
  },

  updateHabit: async (id: string, data: UpdateHabitPayload): Promise<Habit> => {
    const response = await apiClient.put<ApiResponse<Habit>>(API_ENDPOINTS.HABIT_DETAIL(id), data);
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to update habit');
    return response.data.data;
  },

  deleteHabit: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.HABIT_DETAIL(id));
    if (!response.data.success) throw new Error(response.data.error || 'Failed to delete habit');
  },

  checkIn: async (id: string): Promise<Habit> => {
    const response = await apiClient.post<ApiResponse<Habit>>(API_ENDPOINTS.HABIT_CHECKIN(id));
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Check-in failed');
    return response.data.data;
  },

  undoCheckIn: async (id: string): Promise<Habit> => {
    const response = await apiClient.delete<ApiResponse<Habit>>(API_ENDPOINTS.HABIT_CHECKIN(id));
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Undo check-in failed');
    return response.data.data;
  },
};
