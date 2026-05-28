// src/hooks/useAuth.tsx
import { useState } from 'react';
import {
  authService,
  AuthType,
  VerifyOTPResponse,
  SignupResponse,
  LoginResponse,
} from '../features/auth/services/authService';
import { isValidEmail, isValidPhone } from '../shared/utils/validators';
import { getStoredFcmToken } from '../lib/firebase/messaging';

export type { AuthType };

/**
 * Derives the auth type from an identifier string.
 * Returns null when the input is neither a valid email nor a valid Indian
 * mobile number, so callers can show a friendly validation error.
 */
export const inferAuthType = (identifier: string): AuthType | null => {
  if (isValidEmail(identifier)) return 'email';
  if (isValidPhone(identifier)) return 'phone';
  return null;
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  /**
   * Sign up a new user.
   * `type` is derived automatically from the email field; it is always
   * 'email' for signup because both email + mobile are collected.
   */
  const signup = async (
    name: string,
    email: string,
    mobile: string,
  ): Promise<SignupResponse> => {
    if (!name.trim()) {
      const msg = 'Please enter your name';
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidEmail(email)) {
      const msg = 'Please enter a valid email address';
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidPhone(mobile)) {
      const msg = 'Please enter a valid 10-digit mobile number';
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup({ name, email, mobile, type: 'email' });
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send an OTP to the given identifier (email or phone number).
   * Type is inferred automatically.
   */
  const sendOTP = async (identifier: string): Promise<LoginResponse> => {
    const type = inferAuthType(identifier);
    if (!type) {
      const msg = 'Please enter a valid email address or 10-digit mobile number';
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ login: identifier, type });
      console.log('Login (send OTP) response:', response);
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify an OTP.
   * Type is inferred from the identifier; FCM token is pulled from localStorage.
   */
  const verifyOTP = async (
    otp: string,
    identifier: string,
  ): Promise<VerifyOTPResponse> => {
    const fcmToken = getStoredFcmToken();

    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOTP({ login: identifier, otp, fcmToken });
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, sendOTP, verifyOTP, loading, error, clearError };
};
