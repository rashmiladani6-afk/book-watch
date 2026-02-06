/**
 * Application Routes
 * Centralized route configuration
 */

import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

// Pages
import Home from '@/features/movies/pages/Home';
import MovieDetail from '@/features/movies/pages/MovieDetail';
import SeatSelection from '@/features/booking/pages/SeatSelection';
import TicketBook from '@/features/booking/pages/TicketBook';
import Payment from '@/features/booking/pages/Payment';
import EventTypes from '@/features/events/pages/EventTypes';
import EventsList from '@/features/events/pages/EventsList';
import EventDetail from '@/features/events/pages/EventDetail';
import Auth from '@/features/auth/pages/Auth';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetail />} />
            <Route path={ROUTES.TICKET_BOOK} element={<TicketBook />} />
            <Route path={ROUTES.SEAT_SELECTION} element={<SeatSelection />} />
            <Route path={ROUTES.EVENTS} element={<EventTypes />} />
            <Route path="/events/list" element={<EventsList />} />
            <Route path={ROUTES.EVENT_DETAIL} element={<EventDetail />} />
            <Route path={ROUTES.PAYMENT} element={<Payment />} />
            {/* <Route path={ROUTES.AUTH} element={<Auth />} /> */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
    );
};
