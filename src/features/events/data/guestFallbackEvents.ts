import type { PopularEvent, PopularEventsResponse } from "@/features/events/services/eventService";

const fallbackEvents: PopularEvent[] = [
  {
    id: 1001,
    name: "Sheri Garba",
    status: "Live",
    start_date: "2026-06-07 18:00:00",
    end_date: "2026-06-07 23:00:00",
    price: 100,
    image: null,
    address: "Ahmedabad, Gujarat",
    organizer: "Sheri Garba Mandal",
    booked_tickets: 128,
    rating: 4.2,
    attendee_count: 128,
  },
  {
    id: 1002,
    name: "Rang Ratri",
    status: "Live",
    start_date: "2026-06-20 19:00:00",
    end_date: "2026-06-20 23:30:00",
    price: 200,
    image: null,
    address: "Rajkot, Gujarat",
    organizer: "Rang Ratri Group",
    booked_tickets: 256,
    rating: 4.8,
    attendee_count: 256,
  },
  {
    id: 1003,
    name: "Mandli Garba Night",
    status: "Live",
    start_date: "2026-06-15 18:30:00",
    end_date: "2026-06-15 23:00:00",
    price: 150,
    image: null,
    address: "Surat, Gujarat",
    organizer: "Mandli Garba",
    booked_tickets: 89,
    rating: 4.5,
    attendee_count: 89,
  },
];

export const buildGuestFallbackEventsResponse = (): PopularEventsResponse => ({
  status: "success",
  message: "Showing sample events because live API guest access is unavailable.",
  meta: { total: fallbackEvents.length, limit: fallbackEvents.length, offset: 0, has_more: false },
  data: fallbackEvents,
});

export const isGuestFallbackEnabled = () =>
  import.meta.env.VITE_GARBATOWN_ALLOW_GUEST_FALLBACK !== "false";
