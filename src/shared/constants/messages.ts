/**
 * User-facing messages and notifications
 */
export const MESSAGES = {
    AUTH: {
        SIGN_IN_SUCCESS: 'Successfully signed in!',
        SIGN_UP_SUCCESS: 'Account created successfully!',
        SIGN_OUT_SUCCESS: 'Successfully signed out',
        AUTH_ERROR: 'Authentication failed. Please try again.',
        EMAIL_REQUIRED: 'Email is required',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    },
    BOOKING: {
        SELECT_SEATS: 'Please select at least one seat',
        BOOKING_SUCCESS: 'Booking confirmed successfully!',
        BOOKING_ERROR: 'Booking failed. Please try again.',
        PAYMENT_PROCESSING: 'Processing payment...',
        PAYMENT_SUCCESS: 'Payment successful!',
    },
    ERRORS: {
        GENERIC: 'Something went wrong. Please try again.',
        NETWORK: 'Network error. Please check your connection.',
        NOT_FOUND: 'The requested resource was not found.',
    },
} as const;
