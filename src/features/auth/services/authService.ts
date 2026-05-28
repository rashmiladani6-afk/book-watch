// src/features/auth/services/authService.ts
import axios from 'axios';

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

export type AuthType = 'email' | 'phone';

export interface SignupRequest {
  name: string;
  email: string;
  mobile: string;
  type: AuthType;
}

export interface SignupResponse {
  status: string;
  message: string;
  OTP?: string;
  data?: Record<string, unknown>;
}

export interface LoginRequest {
  login: string;
  type: AuthType;
}

export interface LoginResponse {
  status: string;
  message: string;
  otp?: string;
  data: Array<{ message: string }>;
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

// ── Service ────────────────────────────────────────────────────────────────

export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/signup`,
        {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          type: data.type,
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
      const response = await axios.post(
        `${AUTH_BASE_URL}/login`,
        { login: data.login, type: data.type },
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
      const resolvedFcmToken = (data.fcmToken ?? "").trim() || "web-client-fallback-token";
      const response = await axios.post(
        `${AUTH_BASE_URL}/verify-otp`,
        {
          login: data.login,
          otp: data.otp,
          // Backend variants observed across environments.
          fcm_token: resolvedFcmToken,
          fcmToken: resolvedFcmToken,
          r_fcm_token: resolvedFcmToken,
          rfcm_token: resolvedFcmToken,
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
