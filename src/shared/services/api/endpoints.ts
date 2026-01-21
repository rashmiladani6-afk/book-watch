/**
 * API Endpoints
 * Centralized endpoint definitions
 */

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        SIGN_IN: '/auth/signin',
        SIGN_UP: '/auth/signup',
        SIGN_OUT: '/auth/signout',
        REFRESH: '/auth/refresh',
        PROFILE: '/auth/profile',
    },

    // Movie endpoints
    MOVIES: {
        LIST: '/movies',
        DETAIL: (id: string) => `/movies/${id}`,
        SEARCH: '/movies/search',
        BY_CATEGORY: (category: string) => `/movies/category/${category}`,
        THEATERS: (movieId: string) => `/movies/${movieId}/theaters`,
    },

    // Event endpoints
    EVENTS: {
        LIST: '/events',
        DETAIL: (id: string) => `/events/${id}`,
        BY_TYPE: (type: string) => `/events/type/${type}`,
    },

    // Booking endpoints
    BOOKINGS: {
        CREATE: '/bookings',
        LIST: '/bookings',
        DETAIL: (id: string) => `/bookings/${id}`,
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
        SEATS: (showId: string) => `/bookings/seats/${showId}`,
    },

    // Payment endpoints
    PAYMENT: {
        INITIATE: '/payment/initiate',
        VERIFY: '/payment/verify',
        STATUS: (transactionId: string) => `/payment/status/${transactionId}`,
    },

    // Theater endpoints
    THEATERS: {
        LIST: '/theaters',
        DETAIL: (id: string) => `/theaters/${id}`,
        SHOWS: (theaterId: string) => `/theaters/${theaterId}/shows`,
    },
} as const;
