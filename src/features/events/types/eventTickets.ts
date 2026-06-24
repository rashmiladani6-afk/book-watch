import type { CartTicketDetail } from "@/features/events/services/cartService";

export interface EventTicketOption {
  id: number;
  name: string;
  type: string;
  price: number;
  date?: string;
  max_seats?: number;
  booked_tickets?: number;
  available_tickets?: number;
}

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const toString = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeTicketRecord = (raw: Record<string, unknown>): EventTicketOption | null => {
  const id = toNumber(raw.id, 0);
  if (!id) return null;

  const name = toString(raw.name) || toString(raw.title) || "Registration";
  const type = toString(raw.type) || toString(raw.ticket_type) || name;

  return {
    id,
    name,
    type,
    price: toNumber(raw.price, 0),
    date: toString(raw.date) || undefined,
    max_seats:
      toNumber(raw.max_seats, toNumber(raw.maximum_seats, toNumber(raw.maximum_buy, 0))) ||
      undefined,
    booked_tickets: toNumber(raw.booked_tickets, 0) || undefined,
    available_tickets: toNumber(raw.available_tickets, 0) || undefined,
  };
};

export const parseEventTicketsFromPayload = (payload: Record<string, unknown>): EventTicketOption[] => {
  const sources = [
    payload.tickets_type,
    payload.tickets,
    payload.ticket_types,
  ];

  for (const source of sources) {
    if (!Array.isArray(source)) continue;
    const tickets = (source as Array<Record<string, unknown>>)
      .map(normalizeTicketRecord)
      .filter((ticket): ticket is EventTicketOption => Boolean(ticket));
    if (tickets.length > 0) return tickets;
  }

  return [];
};

export const mapCartTicketToEventTicket = (ticket: CartTicketDetail): EventTicketOption => ({
  id: ticket.id,
  name: ticket.name,
  type: ticket.type,
  price: ticket.price,
  date: ticket.date,
  max_seats: ticket.max_seats,
  booked_tickets: ticket.booked_tickets,
  available_tickets: ticket.available_tickets,
});

export const eventTicketToCartTicket = (ticket: EventTicketOption): CartTicketDetail => ({
  id: ticket.id,
  name: ticket.name,
  type: ticket.type,
  price: ticket.price,
  date: ticket.date ?? "",
  max_seats: ticket.max_seats,
  booked_tickets: ticket.booked_tickets,
  available_tickets: ticket.available_tickets,
});
