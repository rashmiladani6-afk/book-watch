/**
 * Helper utility functions
 */

import type { Seat } from '../types/common';
import { SEAT_CONFIG, APP_CONFIG } from '../constants/config';

/**
 * Generate unique ID
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate seat price based on type
 */
export const calculateSeatPrice = (basePrice: number, seatType: 'regular' | 'premium'): number => {
    return seatType === 'premium'
        ? basePrice * APP_CONFIG.PREMIUM_SEAT_MULTIPLIER
        : basePrice;
};

/**
 * Calculate total booking amount
 */
export const calculateBookingTotal = (seats: Seat[]): number => {
    const seatsTotal = seats.reduce((sum, seat) => sum + (seat.price || 0), 0);
    const convenienceFee = seats.length * APP_CONFIG.CONVENIENCE_FEE_PER_TICKET;
    return seatsTotal + convenienceFee;
};

/**
 * Check if seat is premium based on row
 */
export const isPremiumSeat = (row: string): boolean => {
    return SEAT_CONFIG.PREMIUM_ROWS.includes(row);
};

/**
 * Delay function for async operations
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Get random item from array
 */
export const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};
