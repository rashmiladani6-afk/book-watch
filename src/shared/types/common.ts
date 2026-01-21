/**
 * Common types used across the application
 */

export type ContentType = 'movies' | 'stream' | 'events' | 'plays' | 'sports' | 'activities';

export type SeatStatus = 'available' | 'selected' | 'booked';

export type SeatType = 'regular' | 'premium';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

/**
 * Common interfaces
 */
export interface Seat {
    id: string;
    row: string;
    number: number;
    status: SeatStatus;
    type: SeatType;
    price?: number;
}

export interface ShowTime {
    time: string;
    price: number;
    showId: string;
}

export interface Theater {
    id: string;
    name: string;
    location?: string;
    showTimes: ShowTime[];
}

export interface Movie {
    id: string;
    type: ContentType;
    title: string;
    image: string;
    bannerImage?: string;
    rating: number;
    votes: string;
    genre: string[];
    duration: string;
    language: string[];
    releaseDate: string;
    description: string;
    cast?: string[];
    crew?: string[];
    theaters?: Theater[];
    trailerUrl?: string;
}

export interface Event {
    id: string;
    type: ContentType;
    title: string;
    image: string;
    rating?: number;
    votes?: string;
    genre: string[];
    date?: string;
    location?: string;
    description?: string;
    price?: number;
}

export interface BookingData {
    movieId: string;
    movieTitle: string;
    theaterName: string;
    showTime: string;
    showDate: string;
    seats: Seat[];
    totalAmount: number;
    convenienceFee: number;
    userId?: string;
}

export interface User {
    id: string;
    email: string;
    fullName?: string;
    phone?: string;
}
