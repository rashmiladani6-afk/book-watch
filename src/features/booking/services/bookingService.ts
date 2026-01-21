/**
 * Booking Service
 * Handles all booking-related API calls
 */

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import type { BookingData, Seat } from '@/shared/types/common';
import type { ApiResponse } from '@/shared/types/api';
import { supabase } from '@/lib/supabase/client';

export const bookingService = {
    /**
     * Create a new booking
     */
    async createBooking(bookingData: BookingData): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);

            // Temporary: Use Supabase directly
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    movie_title: bookingData.movieTitle,
                    theater_name: bookingData.theaterName,
                    show_time: bookingData.showTime,
                    show_date: bookingData.showDate,
                    seats: bookingData.seats,
                    total_amount: bookingData.totalAmount,
                    payment_status: 'completed',
                    booking_status: 'confirmed',
                })
                .select()
                .single();

            if (error) throw error;

            return {
                data,
                success: true,
                message: 'Booking created successfully',
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get user bookings
     */
    async getUserBookings(): Promise<ApiResponse<any[]>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get(API_ENDPOINTS.BOOKINGS.LIST);

            // Temporary: Use Supabase directly
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return {
                data: data || [],
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Get available seats for a show
     * TODO: Replace with API call
     */
    async getAvailableSeats(showId: string): Promise<ApiResponse<Seat[]>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.get<Seat[]>(API_ENDPOINTS.BOOKINGS.SEATS(showId));

            // Temporary: Generate mock seats
            // This will be replaced by actual seat availability from backend
            return {
                data: [],
                success: true,
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Cancel a booking
     */
    async cancelBooking(bookingId: string): Promise<ApiResponse<any>> {
        try {
            // Uncomment when backend is ready:
            // return await apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(bookingId));

            // Temporary: Use Supabase directly
            const { data, error } = await supabase
                .from('bookings')
                .update({ booking_status: 'cancelled' })
                .eq('id', bookingId)
                .select()
                .single();

            if (error) throw error;

            return {
                data,
                success: true,
                message: 'Booking cancelled successfully',
            };
        } catch (error: any) {
            throw error;
        }
    },
};
