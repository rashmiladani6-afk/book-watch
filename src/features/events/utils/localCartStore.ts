import type { CartEventDetail } from "@/features/events/services/cartService";
import type { EventTicketOption } from "@/features/events/types/eventTickets";

const STORAGE_KEY = "garba_extra_cart_entries";

export interface LocalCartEntry {
  event: CartEventDetail;
  tickets: EventTicketOption[];
  quantities: Record<number, number>;
}

const readRaw = (): LocalCartEntry[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalCartEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRaw = (entries: LocalCartEntry[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const readLocalCartEntries = (): LocalCartEntry[] => readRaw();

export const clearLocalCartEntries = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const removeLocalCartEntry = (eventId: number) => {
  writeRaw(readRaw().filter((entry) => entry.event.id !== eventId));
};

export const upsertLocalCartTicket = (
  event: CartEventDetail,
  tickets: EventTicketOption[],
  ticket: EventTicketOption,
  qty = 1,
) => {
  const entries = readRaw();
  const index = entries.findIndex((entry) => entry.event.id === event.id);

  if (index >= 0) {
    const existing = entries[index];
    entries[index] = {
      ...existing,
      tickets: tickets.length > 0 ? tickets : existing.tickets,
      quantities: {
        ...existing.quantities,
        [ticket.id]: Math.max(qty, existing.quantities[ticket.id] ?? 0),
      },
    };
  } else {
    entries.push({
      event,
      tickets,
      quantities: { [ticket.id]: qty },
    });
  }

  writeRaw(entries);
};

export const updateLocalCartQuantity = (
  eventId: number,
  ticketId: number,
  qty: number,
) => {
  const entries = readRaw();
  const index = entries.findIndex((entry) => entry.event.id === eventId);
  if (index < 0) return;

  const entry = entries[index];
  const quantities = { ...entry.quantities };

  if (qty <= 0) {
    delete quantities[ticketId];
  } else {
    quantities[ticketId] = qty;
  }

  if (Object.keys(quantities).length === 0) {
    entries.splice(index, 1);
  } else {
    entries[index] = { ...entry, quantities };
  }

  writeRaw(entries);
};

export const countLocalCartEvents = () => readRaw().length;

export const countTotalCartEvents = (apiEventId?: number | null) => {
  const local = readRaw();
  const apiCount = apiEventId ? 1 : 0;
  const localOnly = local.filter((entry) => entry.event.id !== apiEventId).length;
  return apiCount + localOnly;
};
