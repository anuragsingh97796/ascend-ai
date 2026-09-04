import { create } from 'zustand';
import { AuthState, LoginPayload, RegisterPayload } from '../domain/auth.types';
import { authApi } from '../api/authApi';
import { User } from '@shared/types/api.types';
import { storage } from '@shared/services/storage';
import { STORAGE_KEYS } from '@core/constants/storage';

interface AuthStore extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(payload);
      const jwtToken = response.token || response.accessToken || '';
      storage.set(STORAGE_KEYS.AUTH_TOKEN, jwtToken);

      const user: User = {
        id: response.id || response.userId || '',
        name: response.name,
        email: response.email,
        avatarInitials:
          response.avatarInitials ||
          (response.name ? response.name.substring(0, 2).toUpperCase() : 'AI'),
        joinedAt: new Date().toISOString(),
      };

      set({
        user,
        token: jwtToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(payload);
      const jwtToken = response.token || response.accessToken || '';
      storage.set(STORAGE_KEYS.AUTH_TOKEN, jwtToken);

      const user: User = {
        id: response.id || response.userId || '',
        name: response.name,
        email: response.email,
        joinedAt: new Date().toISOString(),
        avatarInitials:
          response.avatarInitials ||
          (response.name ? response.name.substring(0, 2).toUpperCase() : 'AI'),
      };

      set({
        user,
        token: jwtToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initialize: async () => {
    const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await authApi.getProfile();
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (_error: any) {
      // Token is invalid or expired
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
