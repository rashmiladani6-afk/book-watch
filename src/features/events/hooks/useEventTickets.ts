import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";
import { eventService } from "@/features/events/services/eventService";
import {
  mapCartTicketToEventTicket,
  type EventTicketOption,
} from "@/features/events/types/eventTickets";

export const EVENT_TICKETS_QUERY_KEY = ["event-tickets"] as const;

interface LoadTicketsResult {
  tickets: EventTicketOption[];
}

const loadEventTicketsFromDetails = async (
  eventId: number,
  userToken: string,
): Promise<EventTicketOption[]> => {
  const details = await eventService.getEventDetailsById(String(eventId), userToken);
  return details?.tickets ?? [];
};

const loadTicketsFromCart = async (
  eventId: number,
  userToken: string,
): Promise<LoadTicketsResult> => {
  const existing = await cartService.getCartDetail(userToken);
  const existingEvent = existing.fullDetail?.event;
  if (
    existingEvent?.id === eventId &&
    (existing.fullDetail?.tickets?.length ?? 0) > 0
  ) {
    return {
      tickets: existing.fullDetail.tickets.map(mapCartTicketToEventTicket),
    };
  }

  const addResult = await cartService.addToCart(eventId, userToken);

  if (addResult.popup) {
    const tickets = await loadEventTicketsFromDetails(eventId, userToken);
    return { tickets };
  }

  const updated = await cartService.getCartDetail(userToken);
  const updatedEvent = updated.fullDetail?.event;
  const tickets =
    updatedEvent?.id === eventId
      ? (updated.fullDetail?.tickets ?? []).map(mapCartTicketToEventTicket)
      : [];

  if (tickets.length === 0) {
    const fallbackTickets = await loadEventTicketsFromDetails(eventId, userToken);
    return { tickets: fallbackTickets };
  }

  return { tickets };
};

export const useEventTickets = (
  eventId: number | undefined,
  prefetchedTickets: EventTicketOption[] | undefined,
  userToken: string | null | undefined,
  enabled: boolean,
) => {
  const hasPrefetched = (prefetchedTickets?.length ?? 0) > 0;

  const query = useQuery({
    queryKey: [...EVENT_TICKETS_QUERY_KEY, eventId, userToken ?? ""],
    queryFn: () => loadTicketsFromCart(eventId as number, userToken as string),
    enabled: enabled && !!eventId && !!userToken && !hasPrefetched,
    staleTime: 30_000,
    retry: false,
  });

  if (hasPrefetched) {
    return {
      tickets: prefetchedTickets ?? [],
      isLoading: false,
      isFetching: false,
      error: null as Error | null,
      refetch: query.refetch,
    };
  }

  return {
    tickets: query.data?.tickets ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
};
