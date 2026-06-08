/**
 * Movie Service
 * Handles all movie-related API calls
 */

import type { Movie, ContentType } from '@/shared/types/common';
import type { ApiResponse } from '@/shared/types/api';

export const movieService = {
    async getMovies(): Promise<ApiResponse<Movie[]>> {
        try {
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.LIST);
            return { data: [], success: true };
        } catch (error: any) {
            throw error;
        }
    },

    async getMovieById(id: string): Promise<ApiResponse<Movie>> {
        try {
            // return await apiClient.get<Movie>(API_ENDPOINTS.MOVIES.DETAIL(id));
            throw new Error('Movie not found');
        } catch (error: any) {
            throw error;
        }
    },

    async searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
        try {
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, { params: { q: query } });
            return { data: [], success: true };
        } catch (error: any) {
            throw error;
        }
    },

    async getMoviesByCategory(category: ContentType): Promise<ApiResponse<Movie[]>> {
        try {
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.BY_CATEGORY(category));
            return { data: [], success: true };
        } catch (error: any) {
            throw error;
        }
    },

    async getMovieTheaters(movieId: string): Promise<ApiResponse<any>> {
        try {
            // return await apiClient.get(API_ENDPOINTS.MOVIES.THEATERS(movieId));
            return { data: [], success: true };
        } catch (error: any) {
            throw error;
        }
    },
};
