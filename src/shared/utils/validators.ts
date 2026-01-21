/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string, minLength = 6): boolean => {
    return password.length >= minLength;
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (value: string): boolean => {
    return !value || value.trim().length === 0;
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
    if (typeof value === 'string') {
        return !isEmpty(value);
    }
    return value !== null && value !== undefined;
};
