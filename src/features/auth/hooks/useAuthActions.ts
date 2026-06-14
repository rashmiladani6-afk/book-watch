import { useState } from "react";
import {
  authService,
  type ForgotPasswordResponse,
  type LoginResponse,
  type SignupResponse,
  type VerifyOTPResponse,
} from "@/features/auth/services/authService";
import { isValidEmail, isValidPhone } from "@/shared/utils/validators";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const signup = async (
    name: string,
    email: string,
    mobile: string,
    password: string,
  ): Promise<SignupResponse> => {
    if (!name.trim()) {
      const msg = "Please enter your name";
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidEmail(email)) {
      const msg = "Please enter a valid email address";
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidPhone(mobile)) {
      const msg = "Please enter a valid 10-digit mobile number";
      setError(msg);
      throw new Error(msg);
    }
    if (!password.trim()) {
      const msg = "Please enter a password";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      return await authService.signup({ name, email, mobile, password });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Signup failed. Please try again.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (
    identifier: string,
    password: string,
  ): Promise<LoginResponse> => {
    if (!identifier.trim()) {
      const msg = "Please enter your email or mobile number";
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      const msg = "Please enter a valid email address or 10-digit mobile number";
      setError(msg);
      throw new Error(msg);
    }
    if (!password.trim()) {
      const msg = "Please enter your password";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      return await authService.login({
        login: identifier,
        type: "password",
        password,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Sign in failed. Please try again.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (
    otp: string,
    identifier: string,
  ): Promise<VerifyOTPResponse> => {
    setLoading(true);
    setError(null);
    try {
      return await authService.verifyOTP({ login: identifier, otp });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid OTP. Please try again.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (login: string): Promise<ForgotPasswordResponse> => {
    if (!login.trim()) {
      const msg = "Please enter your email or mobile number";
      setError(msg);
      throw new Error(msg);
    }
    if (!isValidEmail(login) && !isValidPhone(login)) {
      const msg = "Please enter a valid email address or 10-digit mobile number";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword({ login: login.trim() });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not send reset instructions. Please try again.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loginWithPassword, verifyOTP, forgotPassword, loading, error, clearError };
};
