/**
 * Application configuration constants
 */
export const APP_CONFIG = {
    APP_NAME: 'BookWatch',
    DEFAULT_CITY: 'Mumbai',
    CURRENCY: '₹',
    CONVENIENCE_FEE_PER_TICKET: 30,
    PREMIUM_SEAT_MULTIPLIER: 1.5,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    TIMEOUT: 30000,
} as const;

/**
 * Seat configuration
 */
export const SEAT_CONFIG = {
    ROWS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    SEATS_PER_ROW: 12,
    PREMIUM_ROWS: ['A', 'B'],
} as const;
