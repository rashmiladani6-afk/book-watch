/**
 * Centralized route constants
 */
export const ROUTES = {
    HOME: '/',
    MOVIE_DETAIL: '/movie/:id',
    TICKET_BOOK: '/ticket/:id',
    SEAT_SELECTION: '/book/:showId',
    EVENTS: '/events',
    EVENT_DETAIL: '/events/:id',
    FAVORITE_EVENTS: '/events/favorites',
    AUTH: '/auth',
    PAYMENT: '/payment',
    NOT_FOUND: '*',
} as const;

/**
 * Helper functions to generate routes with parameters
 */
export const generateRoute = {
    movieDetail: (id: string) => `/movie/${id}`,
    ticketBook: (id: string) => `/ticket/${id}`,
    seatSelection: (showId: string) => `/book/${showId}`,
    eventDetail: (id: number | string) => `/events/${id}`,
    favoriteEvents: () => '/events/favorites',
};
