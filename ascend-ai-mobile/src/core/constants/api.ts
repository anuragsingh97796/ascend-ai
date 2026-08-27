/**
 * All API base URLs and endpoint paths.
 * Base URL is sourced from environment variables.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080';
export const API_TIMEOUT_MS = 15_000;

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',

  // User
  USER_ME: '/api/users/me',

  // Goals
  GOALS_LIST: '/api/goals',
  GOAL_DETAIL: (id: string) => `/api/goals/${id}`,

  // Habits
  HABITS_LIST: '/api/habits',
  HABIT_DETAIL: (id: string) => `/api/habits/${id}`,
  HABIT_CHECKIN: (id: string) => `/api/habits/${id}/checkin`,

  // Journal
  JOURNAL_LIST: '/api/journal',
  JOURNAL_DETAIL: (_id: string) => '/api/journal',

  // AI (future)
  AI_CHAT: '/api/ai/chat',
} as const;
