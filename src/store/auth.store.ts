/**
 * Ascend AI — Auth Store (Zustand)
 * Integrated with Spring Boot JWT Backend API
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockSignIn, mockSignUp, clearStoredAuth } from "@/application/services/authService";
import type { User } from "@/domain/entities/User";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignIn(email, pass);
          const token = typeof window !== "undefined" ? localStorage.getItem("ascend_token") : null;
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("ascend_refresh_token") : null;
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Authentication failed";
          set({ isLoading: false, error: msg });
          throw err;
        }
      },

      signUp: async (name, email, pass) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignUp(name, email, pass);
          const token = typeof window !== "undefined" ? localStorage.getItem("ascend_token") : null;
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("ascend_refresh_token") : null;
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Registration failed";
          set({ isLoading: false, error: msg });
          throw err;
        }
      },

      signOut: () => {
        clearStoredAuth();
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "ascend-ai:auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
