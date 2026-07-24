/**
 * Ascend AI — Application Constants
 */

export const APP_NAME = "Ascend AI" as const;
export const APP_TAGLINE =
  "Your AI Powered Personal Transformation Platform" as const;
export const APP_VERSION = "0.1.0" as const;

export const LAYOUT = {
  NAVBAR_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  SIDEBAR_COLLAPSED_WIDTH: 72,
  CONTAINER_MAX_WIDTH: 1280,
  CONTAINER_PADDING_X: 24,
} as const;

export const ROUTES = {
  HOME: "/",
  PRICING: "/pricing",
  ABOUT: "/about",
  BLOG: "/blog",
  CHANGELOG: "/changelog",
  DOCS: "/docs",
  DASHBOARD: "/dashboard",
  DASHBOARD_COACH: "/dashboard/coach",
  DASHBOARD_GOALS: "/dashboard/goals",
  DASHBOARD_HABITS: "/dashboard/habits",
  DASHBOARD_JOURNAL: "/dashboard/journal",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_INSIGHTS: "/dashboard/insights",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  AUTH_SIGN_IN: "/auth/sign-in",
  AUTH_SIGN_UP: "/auth/sign-up",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
