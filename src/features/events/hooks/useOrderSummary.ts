import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";

export const ORDER_SUMMARY_QUERY_KEY = ["order-summary"] as const;

export const useOrderSummary = (
  eventId?: number,
  ticketId?: number | null,
  qty = 1,
  userToken?: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...ORDER_SUMMARY_QUERY_KEY, eventId, ticketId, qty, userToken ?? ""],
    queryFn: () =>
      cartService.getOrderSummary(eventId as number, ticketId as number, qty, userToken),
    enabled: enabled && !!userToken && !!eventId && !!ticketId && qty > 0,
    staleTime: 10_000,
    retry: false,
  });
};
