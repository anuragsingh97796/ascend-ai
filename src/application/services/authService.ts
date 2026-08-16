/**
 * Ascend AI — Authentication Service connected to Spring Boot 3 Real JWT API
 */

import type { User } from "@/domain/entities/User";
import { apiClient } from "@/infrastructure/api/apiClient";
import axios from "axios";

const AUTH_KEY = "ascend:auth";
const TOKEN_KEY = "ascend_token";
const REFRESH_TOKEN_KEY = "ascend_refresh_token";

export function getStoredAuth(): {
  user: User;
  isAuthenticated: boolean;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ user, isAuthenticated: true })
    );
  }
}

export function clearStoredAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    if (response.data?.success && response.data?.data) {
      const data = response.data.data;
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatarInitials: data.avatarInitials || "AI",
        joinedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      setStoredAuth(user);
      return user;
    }
    throw new Error(response.data?.message || "Invalid credentials.");
 } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Authentication failed.";

    throw new Error(message);
  }

  if (err instanceof Error) {
    throw new Error(err.message);
  }

  throw new Error("Authentication failed.");
}
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    if (response.data?.success) {
      return signIn(email, password);
    }
    throw new Error(response.data?.message || "Registration failed.");
  } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Registration failed.";

    throw new Error(message);
  }

  if (err instanceof Error) {
    throw new Error(err.message);
  }

  throw new Error("Registration failed.");
}
}
