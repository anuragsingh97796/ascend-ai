import { apiClient } from '@shared/services/apiClient';
import { API_ENDPOINTS } from '@core/constants/api';
import { AuthResponse, LoginPayload, RegisterPayload } from '../domain/auth.types';
import { ApiResponse, User } from '@shared/types/api.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH_LOGIN,
      payload,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Login failed');
    }
    return response.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH_REGISTER,
      payload,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Registration failed');
    }
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER_ME);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch profile');
    }
    return response.data.data;
  },
};
