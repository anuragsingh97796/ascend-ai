// Application Store: Auth (localStorage-based, no external state library)

import type { User } from "@/domain/entities/User";

const KEY = "ascend:auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStoredAuth(): {
  user: User;
  isAuthenticated: boolean;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: User): void {
  localStorage.setItem(KEY, JSON.stringify({ user, isAuthenticated: true }));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(KEY);
}

export async function mockSignIn(
  email: string,
  password: string
): Promise<User> {
  await new Promise((r) => setTimeout(r, 900));
  if (!email || password.length < 6) throw new Error("Invalid credentials.");
  const name = email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const user: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    avatarInitials: getInitials(name),
    joinedAt: new Date().toISOString(),
  };
  setStoredAuth(user);
  return user;
}

export async function mockSignUp(
  name: string,
  email: string,
  password: string
): Promise<User> {
  await new Promise((r) => setTimeout(r, 900));
  if (!name || !email || password.length < 8)
    throw new Error("All fields required. Password min 8 chars.");
  const user: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    avatarInitials: getInitials(name),
    joinedAt: new Date().toISOString(),
  };
  setStoredAuth(user);
  return user;
}
