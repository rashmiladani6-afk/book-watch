/**
 * API-related types
 */

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

/**
 * Dwaaro events API response shape
 */
export interface EventsMeta {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
}

export interface ApiRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
}
