/**
 * Movie Service
 * Handles all movie-related API calls
 */

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import type { Movie, ContentType } from '@/shared/types/common';
import type { ApiResponse } from '@/shared/types/api';

// TODO: Replace with actual API calls when backend is ready
// For now, import static data as fallback
import { movies as staticMovies } from '@/data/movies';

export const movieService = {
    /**
     * Get all movies
     * TODO: Replace with API call
     */
    async getMovies(): Promise<ApiResponse<Movie[]>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.LIST);

            // Temporary: Return static data
            return {
                data: staticMovies,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get movie by ID
     * TODO: Replace with API call
     */
    async getMovieById(id: string): Promise<ApiResponse<Movie>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get<Movie>(API_ENDPOINTS.MOVIES.DETAIL(id));

            // Temporary: Return static data
            const movie = staticMovies.find((m) => m.id === id);
            if (!movie) {
                throw new Error('Movie not found');
            }
            return {
                data: movie,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Search movies
     * TODO: Replace with API call
     */
    async searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, {
            //   params: { q: query },
            // });

            // Temporary: Filter static data
            const filtered = staticMovies.filter((movie) =>
                movie.title.toLowerCase().includes(query.toLowerCase()) ||
                movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
            );
            return {
                data: filtered,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get movies by category
     * TODO: Replace with API call
     */
    async getMoviesByCategory(category: ContentType): Promise<ApiResponse<Movie[]>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES.BY_CATEGORY(category));

            // Temporary: Filter static data
            const filtered = staticMovies.filter((movie) => movie.type === category);
            return {
                data: filtered,
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get theaters for a movie
     * TODO: Replace with API call
     */
    async getMovieTheaters(movieId: string): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get(API_ENDPOINTS.MOVIES.THEATERS(movieId));

            // Temporary: Return static data
            const movie = staticMovies.find((m) => m.id === movieId);
            return {
                data: movie?.theaters || [],
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },
};
