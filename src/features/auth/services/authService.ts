// src/features/auth/services/authService.ts
import axios from 'axios';

const API_BASE_URL = '/api/v1/odoo';
const AUTH_TOKEN = 'Bearer 3zwg4rojjDnuNPqpOehv4rAwYnLfNZb2JBAN';

export interface LoginRequest {
  login: string;
  type: 'email' | 'phone';
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    message: string;
  };
}

export interface VerifyOTPRequest {
  otp: string;
  login: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const url = `${API_BASE_URL}/login?login=${encodeURIComponent(data.login)}&type=${data.type}`;
      
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', error.response?.data || error);
      throw error;
    }
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<any> => {
    try {
      // Use query parameters just like the login endpoint
      const url = `${API_BASE_URL}/verify-otp?login=${encodeURIComponent(data.login)}&type=email&otp=${data.otp}`;
      
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP Error:', error.response?.data || error);
      throw error;
    }
  },
};