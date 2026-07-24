/**
 * Ascend AI — Auth Store (Zustand)
 *
 * Simulates authentication for Milestone 2.
 * Persists session state to localStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
}

interface AuthState {
  user: User | null;
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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email, pass) => {
        set({ isLoading: true, error: null });
        await delay(1200); // Simulate network
        if (pass === "wrong") {
          set({ isLoading: false, error: "Invalid email or password." });
          throw new Error("Auth failed");
        }
        set({
          user: {
            id: `usr_${Date.now()}`,
            name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
            email,
            joinedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signUp: async (name, email) => {
        set({ isLoading: true, error: null });
        await delay(1500); // Simulate network
        if (email.includes("taken")) {
          set({ isLoading: false, error: "Email is already in use." });
          throw new Error("Auth failed");
        }
        set({
          user: {
            id: `usr_${Date.now()}`,
            name,
            email,
            joinedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signOut: () => set({ user: null, isAuthenticated: false }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "ascend-ai:auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
