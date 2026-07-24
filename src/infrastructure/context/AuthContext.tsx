"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@/domain/entities/User";
import {
  getStoredAuth,
  clearStoredAuth,
  mockSignIn,
  mockSignUp,
} from "@/application/services/authService";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredAuth();
    return stored?.isAuthenticated ? stored.user : null;
  });
  const [isLoading] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await mockSignIn(email, password);
    setUser(u);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const u = await mockSignUp(name, email, password);
    setUser(u);
  }, []);

  const signOut = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      import("@/application/services/authService").then(({ setStoredAuth }) =>
        setStoredAuth(updated)
      );
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
