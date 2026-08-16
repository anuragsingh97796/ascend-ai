# Milestone 7: Production Authentication & Security

This document outlines the authentication and security architecture implemented in Milestone 7 for the Ascend AI Web application.

## Overview

Milestone 7 transitions the application from a mock/local authentication state to a fully secure, JWT-based authentication system interacting with a Spring Boot backend. The frontend architecture relies entirely on **React Query** for server state management, eliminating duplicate/unnecessary Zustand stores for authentication.

## Key Changes

1.  **Backend Integration:**
    *   Authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/logout`) on the Spring Boot backend are fully integrated.
    *   `authService.ts` was updated to securely handle these requests and manage tokens.

2.  **React Query Migration:**
    *   `AuthContext.tsx` and `auth.store.ts` (Zustand) were completely removed.
    *   Authentication state is now managed using `useQuery` (`useCurrentUser`) and mutations (`useLoginMutation`, `useRegisterMutation`, `useLogoutMutation`) in `useAuthHooks.ts`.
    *   This provides automatic caching, background fetching, and loading state management.

3.  **Token Management & Interceptors:**
    *   JWT access tokens are stored in `localStorage` securely.
    *   `apiClient.ts` uses Axios interceptors to automatically attach the Bearer token to all outgoing authenticated requests.
    *   *(Note for future: Refresh token logic can be implemented here by intercepting 401 Unauthorized responses).*

4.  **Route Protection:**
    *   `RouteGuard.tsx` and `withAuth.tsx` (HOC) were updated to use the new `useCurrentUser` React Query hook.
    *   Unauthenticated users attempting to access protected routes (e.g., `/dashboard`) are safely redirected to `/auth/login`.
    *   Authenticated users attempting to access auth routes (e.g., `/auth/login`) are redirected to `/dashboard`.

5.  **Clean Architecture:**
    *   Unused imports and legacy state managers were pruned to adhere strictly to the project's Clean Architecture approach.
    *   Ensured full Type Safety across the application (TypeScript compile checks pass).

## Verification Steps

1.  **Registration (`/auth/register`):** Connects to POST `/api/auth/register`. On success, redirects to Dashboard.
2.  **Login (`/auth/login`):** Connects to POST `/api/auth/login`. Returns JWT. On success, redirects to Dashboard.
3.  **Protected Routes (`/dashboard/*`):** Requires valid JWT. `apiClient` adds Authorization header.
4.  **Logout:** Connects to POST `/api/auth/logout`, clears local storage, invalidates React Query cache, and redirects to Login.

## Next Steps / Future Enhancements

*   Implement HttpOnly cookies for storing JWTs (requires backend configuration).
*   Add Refresh Token flow to `apiClient.ts` interceptors to seamlessly obtain new tokens when the access token expires.
