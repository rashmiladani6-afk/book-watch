// src/hooks/useAuth.tsx
import { useState } from 'react';
import {
  authService,
  extractAuthUser,
  VerifyOTPResponse,
  SignupResponse,
  LoginResponse,
} from '../features/auth/services/authService';
import { isValidEmail, isValidPhone } from '../shared/utils/validators';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  /**
   * Sign up a new user with password.
   */
  const signup = async (
    name: string,
    email: string,
    mobile: string,
    password: string,
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
    if (!password.trim()) {
      const msg = 'Please enter a password';
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup({ name, email, mobile, password });
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
   * Sign in with email/mobile and password.
   */
  const loginWithPassword = async (
    identifier: string,
    password: string,
  ): Promise<LoginResponse> => {
    if (!identifier.trim()) {
      const msg = 'Please enter your email or mobile number';
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      const msg = 'Please enter a valid email address or 10-digit mobile number';
      setError(msg);
      throw new Error(msg);
    }
    if (!password.trim()) {
      const msg = 'Please enter your password';
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({
        login: identifier,
        type: 'password',
        password,
      });
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Sign in failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify an OTP after signup.
   */
  const verifyOTP = async (
    otp: string,
    identifier: string,
  ): Promise<VerifyOTPResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOTP({ login: identifier, otp });
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loginWithPassword, verifyOTP, loading, error, clearError };
};
