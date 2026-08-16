/**
 * Ascend AI — Authentication Service connected to Spring Boot 3 Real JWT API
 */

import type { User } from "@/domain/entities/User";
import { apiClient } from "@/infrastructure/api/apiClient";
import axios from "axios";

const TOKEN_KEY = "ascend_token";
const REFRESH_TOKEN_KEY = "ascend_refresh_token";

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get("/auth/me");
  if (response.data?.success && response.data?.data) {
    const data = response.data.data;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarInitials: data.avatarInitials || "AI",
      joinedAt: data.joinedAt || new Date().toISOString(),
    };
  }
  throw new Error("Failed to fetch user");
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed on backend", error);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
}

export async function signIn(email: string, password: string): Promise<User> {
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
      return user;
    }
    throw new Error(response.data?.message || "Invalid credentials.");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message || err.message || "Authentication failed.";

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
        err.response?.data?.message || err.message || "Registration failed.";

      throw new Error(message);
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Registration failed.");
  }
}
