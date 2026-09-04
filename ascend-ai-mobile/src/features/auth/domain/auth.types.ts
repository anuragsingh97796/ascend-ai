/**
 * Auth types for Ascend AI Mobile.
 * Server-side JWT authentication flow.
 */

import { User } from '@shared/types/api.types';

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  tokenType?: string;
  type?: string;
  refreshToken?: string;
  userId?: string;
  id?: string;
  name: string;
  email: string;
  avatarInitials?: string;
  roles?: string[];
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
