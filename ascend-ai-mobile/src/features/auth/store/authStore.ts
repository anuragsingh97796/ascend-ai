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
  isLoading: true, // starts loading to check token
  error: null,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      // --- TEMPORARY MOCK FOR UI VERIFICATION ---
      // We are skipping the backend API call since the server is offline.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        avatarInitials: 'DU',
        name: 'Demo User',
        email: payload.email,
        joinedAt: new Date().toISOString(),
      };

      storage.set(STORAGE_KEYS.AUTH_TOKEN, 'mock-jwt-token-123');

      set({
        user,
        token: 'mock-jwt-token-123',
        isAuthenticated: true,
        isLoading: false,
      });
      // ------------------------------------------
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(payload);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);

      const user: User = {
        id: response.userId,
        name: response.name,
        email: response.email,
        joinedAt: new Date().toISOString(),
        avatarInitials: response.name.substring(0, 2).toUpperCase(),
      };

      set({
        user,
        token: response.accessToken,
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
      // --- TEMPORARY MOCK FOR UI VERIFICATION ---
      // Validate token by fetching profile
      // const user = await authApi.getProfile();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user: User = {
        id: '1',
        avatarInitials: 'DU',
        name: 'Demo User',
        email: 'demo@ascendai.com',
        joinedAt: new Date().toISOString(),
      };
      // ------------------------------------------

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
