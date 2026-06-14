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
import FavoriteEvents from '@/features/events/pages/FavoriteEvents';
import CartPage from '@/features/events/pages/CartPage';
import MyTicketsPage from '@/features/tickets/pages/MyTicketsPage';
import ProfilePage from '@/features/auth/pages/ProfilePage';
import ContactUsPage from '@/features/contact/pages/ContactUsPage';
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
            <Route path={ROUTES.EVENTS_LIST} element={<EventsList />} />
            <Route path={ROUTES.EVENT_DETAIL} element={<EventDetail />} />
            <Route path={ROUTES.FAVORITE_EVENTS} element={<FavoriteEvents />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.MY_TICKETS} element={<MyTicketsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.CONTACT} element={<ContactUsPage />} />
            <Route path={ROUTES.PAYMENT} element={<Payment />} />
            <Route path={ROUTES.AUTH} element={<Auth />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
    );
};
