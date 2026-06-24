import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";
import {
  mapCartTicketToEventTicket,
  type EventTicketOption,
} from "@/features/events/types/eventTickets";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";

export const EVENT_TICKETS_QUERY_KEY = ["event-tickets"] as const;

interface LoadTicketsResult {
  tickets: EventTicketOption[];
  replaceRequired: boolean;
}

const loadTicketsFromCart = async (
  eventId: number,
  userToken: string,
  force = false,
): Promise<LoadTicketsResult> => {
  const existing = await cartService.getCartDetail(userToken);
  const existingEvent = existing.fullDetail?.event;
  if (
    existingEvent?.id === eventId &&
    (existing.fullDetail?.tickets?.length ?? 0) > 0
  ) {
    return {
      tickets: existing.fullDetail.tickets.map(mapCartTicketToEventTicket),
      replaceRequired: false,
    };
  }

  const addResult = await cartService.addToCart(
    eventId,
    userToken,
    force ? "force" : undefined,
  );

  if (addResult.popup && !force) {
    return { tickets: [], replaceRequired: true };
  }

  const updated = await cartService.getCartDetail(userToken);
  const updatedEvent = updated.fullDetail?.event;
  const tickets =
    updatedEvent?.id === eventId
      ? (updated.fullDetail?.tickets ?? []).map(mapCartTicketToEventTicket)
      : [];

  return { tickets, replaceRequired: false };
};

export const useEventTickets = (
  eventId: number | undefined,
  prefetchedTickets: EventTicketOption[] | undefined,
  userToken: string | null | undefined,
  enabled: boolean,
) => {
  const queryClient = useQueryClient();
  const hasPrefetched = (prefetchedTickets?.length ?? 0) > 0;

  const query = useQuery({
    queryKey: [...EVENT_TICKETS_QUERY_KEY, eventId, userToken ?? ""],
    queryFn: () => loadTicketsFromCart(eventId as number, userToken as string),
    enabled: enabled && !!eventId && !!userToken && !hasPrefetched,
    staleTime: 30_000,
    retry: false,
  });

  const forceLoad = useMutation({
    mutationFn: () =>
      loadTicketsFromCart(eventId as number, userToken as string, true),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.setQueryData(
        [...EVENT_TICKETS_QUERY_KEY, eventId, userToken ?? ""],
        result,
      );
    },
  });

  if (hasPrefetched) {
    return {
      tickets: prefetchedTickets ?? [],
      isLoading: false,
      isFetching: false,
      error: null as Error | null,
      replaceRequired: false,
      forceLoadTickets: forceLoad.mutateAsync,
      isForceLoading: forceLoad.isPending,
      refetch: query.refetch,
    };
  }

  const data = forceLoad.data ?? query.data;

  return {
    tickets: data?.tickets ?? [],
    isLoading: query.isLoading || forceLoad.isPending,
    isFetching: query.isFetching,
    error: (query.error ?? forceLoad.error) as Error | null,
    replaceRequired: data?.replaceRequired ?? false,
    forceLoadTickets: forceLoad.mutateAsync,
    isForceLoading: forceLoad.isPending,
    refetch: query.refetch,
  };
};
