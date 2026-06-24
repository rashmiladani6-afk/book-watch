import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  readLocalCartEntries,
  type LocalCartEntry,
  clearLocalCartEntries,
  removeLocalCartEntry,
  upsertLocalCartTicket,
  updateLocalCartQuantity,
} from "@/features/events/utils/localCartStore";
import type { CartEventDetail } from "@/features/events/services/cartService";
import type { EventTicketOption } from "@/features/events/types/eventTickets";

export const LOCAL_CART_QUERY_KEY = ["local-cart-entries"] as const;

export const useLocalCart = () => {
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: LOCAL_CART_QUERY_KEY,
    queryFn: () => readLocalCartEntries(),
    staleTime: 0,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: LOCAL_CART_QUERY_KEY });

  const addTicket = (
    event: CartEventDetail,
    tickets: EventTicketOption[],
    ticket: EventTicketOption,
    qty = 1,
  ) => {
    upsertLocalCartTicket(event, tickets, ticket, qty);
    void refresh();
  };

  const removeEvent = (eventId: number) => {
    removeLocalCartEntry(eventId);
    void refresh();
  };

  const setQuantity = (eventId: number, ticketId: number, qty: number) => {
    updateLocalCartQuantity(eventId, ticketId, qty);
    void refresh();
  };

  const clearAll = () => {
    clearLocalCartEntries();
    void refresh();
  };

  return {
    entries: entries as LocalCartEntry[],
    addTicket,
    removeEvent,
    setQuantity,
    clearAll,
    refresh,
  };
};
