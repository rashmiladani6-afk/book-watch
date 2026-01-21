/**
 * Formatting utility functions
 */

import { APP_CONFIG } from '../constants/config';

/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
    return `${APP_CONFIG.CURRENCY}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Format time
 */
export const formatTime = (time: string): string => {
    return time;
};

/**
 * Format duration (minutes to hours and minutes)
 */
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

/**
 * Format seat label
 */
export const formatSeatLabel = (row: string, number: number): string => {
    return `${row}${number}`;
};

/**
 * Format array to comma-separated string
 */
export const formatList = (items: string[], limit?: number): string => {
    const displayItems = limit ? items.slice(0, limit) : items;
    return displayItems.join(', ');
};
