/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import type { ApiResponse } from '@/shared/types/api';
import { supabase } from '@/lib/supabase/client';

interface SignUpData {
    email: string;
    password: string;
    fullName?: string;
}

interface SignInData {
    email: string;
    password: string;
}

export const authService = {
    /**
     * Sign up a new user
     */
    async signUp(data: SignUpData): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.post(API_ENDPOINTS.AUTH.SIGN_UP, data);

            // Temporary: Use Supabase directly
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    },
                },
            });

            if (error) throw error;

            return {
                data: authData,
                success: true,
                message: 'Account created successfully',
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Sign in an existing user
     */
    async signIn(data: SignInData): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.post(API_ENDPOINTS.AUTH.SIGN_IN, data);

            // Temporary: Use Supabase directly
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            return {
                data: authData,
                success: true,
                message: 'Signed in successfully',
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Sign out the current user
     */
    async signOut(): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.post(API_ENDPOINTS.AUTH.SIGN_OUT);

            // Temporary: Use Supabase directly
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            return {
                data: null,
                success: true,
                message: 'Signed out successfully',
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get current user session
     */
    async getSession(): Promise<ApiResponse<any>> {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) throw error;

            return {
                data: data.session,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get current user
     */
    async getUser(): Promise<ApiResponse<any>> {
        try {
            const { data, error } = await supabase.auth.getUser();

            if (error) throw error;

            return {
                data: data.user,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },
};
