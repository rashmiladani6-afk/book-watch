// src/features/auth/services/authService.ts
import axios from 'axios';

import { ensureFcmToken } from '@/lib/firebase/messaging';

// Dedicated Garba Town auth proxy path.
// In dev: Vite proxies /garba-auth/* → https://www.garbatown.com/*
// In prod: Vercel rewrites /garba-auth/:path* → https://www.garbatown.com/:path*
// Can be overridden entirely via VITE_GARBATOWN_AUTH_BASE_URL in .env
const AUTH_BASE_URL =
  import.meta.env.VITE_GARBATOWN_AUTH_BASE_URL ?? '/garba-auth/api/v1/odoo';

const AUTH_TOKEN = 'Bearer 2ubGisLUnejgLUandBFhPIEel1W5R55BFsUc';

const authHeaders = {
  Authorization: AUTH_TOKEN,
  'Content-Type': 'application/json',
};

// ── Types ──────────────────────────────────────────────────────────────────

export type LoginType = 'password' | 'otp';

export interface SignupRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  fcmToken?: string | null;
}

export interface SignupResponse {
  status: string;
  message: string;
  OTP?: string;
  otp?: string;
  data?: Record<string, unknown>;
}

export interface LoginRequest {
  login: string;
  type: LoginType;
  password?: string;
  otp?: string;
  fcmToken?: string | null;
}

export interface LoginResponse {
  status: string;
  message: string;
  otp?: string;
  OTP?: string;
  data?: AuthUser | Array<{ message: string }>;
}

export interface VerifyOTPRequest {
  login: string;
  otp: string;
  fcmToken?: string | null;
}

export interface AuthUser {
  user_token?: string;
  token?: string;
  access_token?: string;
  id?: number | string;
  user_id?: string;
  email?: string;
  name?: string;
  type?: string;
  token_expiry?: string;
  image?: string | null;
}

export interface VerifyOTPResponse {
  status: string;
  message: string;
  data?: AuthUser;
}

const withFcmToken = async (fcmToken?: string | null) => {
  const resolved = (fcmToken ?? '').trim() || (await ensureFcmToken());
  return { fcm_token: resolved };
};

export const extractAuthUser = (data: unknown): AuthUser | null => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  const user = data as AuthUser;
  if (user.user_token || user.token || user.access_token) {
    return user;
  }

  return null;
};

// ── Service ────────────────────────────────────────────────────────────────

export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      const fcmPayload = await withFcmToken(data.fcmToken);
      const response = await axios.post(
        `${AUTH_BASE_URL}/signup`,
        {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
          ...fcmPayload,
        },
        { headers: authHeaders },
      );
      return response.data;
    } catch (error: any) {
      console.error('Signup API Error:', error.response?.data || error);
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const fcmPayload = await withFcmToken(data.fcmToken);
      const payload: Record<string, unknown> = {
        login: data.login,
        type: data.type,
        ...fcmPayload,
      };

      if (data.type === 'password') {
        payload.password = data.password;
      }

      if (data.type === 'otp' && data.otp) {
        payload.otp = data.otp;
      }

      const response = await axios.post(
        `${AUTH_BASE_URL}/login`,
        payload,
        { headers: authHeaders },
      );
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', error.response?.data || error);
      throw error;
    }
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    try {
      const fcmPayload = await withFcmToken(data.fcmToken);
      const response = await axios.post(
        `${AUTH_BASE_URL}/verify-otp`,
        {
          login: data.login,
          otp: data.otp,
          ...fcmPayload,
        },
        { headers: authHeaders },
      );
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP Error:', error.response?.data || error);
      throw error;
    }
  },
};
