import { apiClient } from '@shared/services/apiClient';
import { API_ENDPOINTS } from '@core/constants/api';
import { Goal, CreateGoalPayload, UpdateGoalPayload } from '../domain/goal.types';
import { ApiResponse } from '@shared/types/api.types';

export const goalApi = {
  getGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get<ApiResponse<Goal[]>>(API_ENDPOINTS.GOALS_LIST);
    if (!response.data.success) throw new Error(response.data.error || 'Failed to fetch goals');
    return response.data.data || [];
  },

  getGoal: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<ApiResponse<Goal>>(API_ENDPOINTS.GOAL_DETAIL(id));
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to fetch goal');
    return response.data.data;
  },

  createGoal: async (data: CreateGoalPayload): Promise<Goal> => {
    const response = await apiClient.post<ApiResponse<Goal>>(API_ENDPOINTS.GOALS_LIST, data);
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to create goal');
    return response.data.data;
  },

  updateGoal: async (id: string, data: UpdateGoalPayload): Promise<Goal> => {
    const response = await apiClient.put<ApiResponse<Goal>>(API_ENDPOINTS.GOAL_DETAIL(id), data);
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || 'Failed to update goal');
    return response.data.data;
  },

  deleteGoal: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.GOAL_DETAIL(id));
    if (!response.data.success) throw new Error(response.data.error || 'Failed to delete goal');
  },
};
