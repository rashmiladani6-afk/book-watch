// src/features/auth/hooks/useAuth.ts
import { useState } from 'react';
import { authService, LoginRequest } from '../features/auth/services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = async (email: string, type: 'email' | 'phone') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ login: email, type });
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
      throw err;
    }
  };

  const verifyOTP = async (otp: string, login: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyOTP({ otp, login });
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setLoading(false);
      throw err;
    }
  };

  return { sendOTP, verifyOTP, loading, error };
};