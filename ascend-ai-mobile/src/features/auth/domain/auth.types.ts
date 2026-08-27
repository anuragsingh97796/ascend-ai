/**
 * Auth types for Ascend AI Mobile.
 * Server-side JWT authentication flow.
 */

import { User } from '@shared/types/api.types';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  name: string;
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
