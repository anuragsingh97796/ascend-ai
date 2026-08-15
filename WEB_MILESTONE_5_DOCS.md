# Ascend AI Web — Milestone 5 Architecture Documentation

## Overview
This document outlines the architectural changes made during Milestone 5 to integrate the Next.js frontend with the Spring Boot backend. 
The web application no longer relies on `localStorage` for mocking data, except for components that are scheduled for backend integration in later milestones (e.g., Journaling).

## 1. API Client Configuration
- **Location:** `src/infrastructure/api/apiClient.ts`
- **Implementation:** Axios instance configured with a `baseURL` pointing to `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"`.
- **Interceptors:** Automatically injects the JWT `Authorization` header (`Bearer <token>`) to all outgoing requests. Handles 401 Unauthorized responses by clearing stored authentication state.

## 2. Authentication Flow
- **Service:** `src/application/services/authService.ts`
- **Changes:** Switched `mockSignIn` and `mockSignUp` to real API calls against `/api/auth/login` and `/api/auth/register`. 
- **Context:** `src/infrastructure/context/AuthContext.tsx` consumes the real API calls and manages global UI state (loading, user info, authentication status).

## 3. Goals Integration
- **Service:** `src/application/services/goalsService.ts`
- **Methods:** 
  - `getGoals()`: Fetches all goals from the server.
  - `addGoal()`: Posts a new goal, calculates initial progress based on milestones.
  - `updateGoal()`: Updates goal attributes (title, status, milestones) and recalculates progress.
  - `deleteGoal()`: Removes a goal by ID.
- **State Management:** `src/store/goals.store.ts` uses Zustand to wrap these API calls into async actions (`fetchGoals`, `addGoal`, `updateGoal`, `deleteGoal`, `toggleMilestone`). Types are strongly coupled to `src/domain/entities/Goal.ts`.

## 4. Habits Integration
- **Service:** `src/application/services/habitsService.ts`
- **Methods:**
  - `getHabits()`: Fetches all habits from the server.
  - `addHabit()`: Posts a new habit.
  - `deleteHabit()`: Removes a habit by ID.
  - `toggleHabitToday()`: Determines if a habit is completed today. If yes, it removes today's date from `completedDates`. If no, it appends today's date. Calculates streaks and pushes the update to the server via `PUT`.
- **State Management:** `src/store/habits.store.ts` uses Zustand to wrap these API calls. Types are tightly coupled to `src/domain/entities/Habit.ts`.

## 5. UI Integration
- **Dashboards:** All analytical and dashboard pages (`/dashboard`, `/dashboard/goals`, `/dashboard/habits`, `/dashboard/analytics`, `/dashboard/insights`) have been converted from consuming synchronous data fetching logic to asynchronous Zustand store methods using `useEffect()`. This ensures hydration mismatch is avoided and real data reflects instantly.

## 6. Type Safety Alignments
- Consolidates domain entities in `src/domain/entities` instead of relying on duplicate interfaces in `store/*.store.ts` files, providing a single source of truth across UI, State, and API boundaries.
