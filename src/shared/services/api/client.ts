/**
 * API Client Configuration
 * This will be used to make HTTP requests to the backend
 */

import type { ApiRequestConfig, ApiResponse, ApiError } from '../../types/api';
import { API_CONFIG } from '../../constants/config';

class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Generic request handler
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        config?: ApiRequestConfig
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...config?.headers,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config?.timeout || this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error: ApiError = {
                    message: `HTTP Error: ${response.status}`,
                    code: response.status.toString(),
                };
                throw error;
            }

            const data = await response.json();
            return {
                data,
                success: true,
            };
        } catch (error: any) {
            clearTimeout(timeoutId);

            const apiError: ApiError = {
                message: error.message || 'An error occurred',
                code: error.code,
                details: error,
            };

            throw apiError;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
        const queryString = config?.params
            ? '?' + new URLSearchParams(config.params).toString()
            : '';

        return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' }, config);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: JSON.stringify(data),
            },
            config
        );
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(
            endpoint,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            },
            config
        );
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' }, config);
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(
            endpoint,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
            },
            config
        );
    }
}

export const apiClient = new ApiClient();
