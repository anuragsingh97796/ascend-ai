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
      throw new Error(response.data.error || response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH_REGISTER,
      payload,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message || 'Registration failed');
    }
    // After registration, authenticate immediately to obtain JWT session
    return authApi.login({ email: payload.email, password: payload.password });
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.USER_ME);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || response.data.message || 'Failed to fetch profile');
    }
    const d = response.data.data;
    return {
      id: d.id,
      name: d.name,
      email: d.email || d.username || '',
      avatarInitials: d.avatarInitials || (d.name ? d.name.substring(0, 2).toUpperCase() : 'AI'),
      joinedAt: d.joinedAt || new Date().toISOString(),
    };
  },
};
