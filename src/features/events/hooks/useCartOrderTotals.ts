import { useQueries } from "@tanstack/react-query";
import { cartService, type OrderSummaryData } from "@/features/events/services/cartService";
import { ORDER_SUMMARY_QUERY_KEY } from "@/features/events/hooks/useOrderSummary";

export interface CartTicketSelection {
  ticketId: number;
  qty: number;
  label: string;
}

export interface CartOrderLineItem {
  ticketId: number;
  label: string;
  qty: number;
  subtotal: number;
}

export interface CartOrderTotals {
  lineItems: CartOrderLineItem[];
  convenienceFee: number;
  total: number;
  isLoading: boolean;
  isError: boolean;
  summaries: OrderSummaryData[];
}

export const useCartOrderTotals = (
  eventId: number | undefined,
  selections: CartTicketSelection[],
  userToken?: string | null,
  enabled = true,
): CartOrderTotals => {
  const activeSelections = selections.filter((s) => s.qty > 0);

  const queries = useQueries({
    queries: activeSelections.map((selection) => ({
      queryKey: [
        ...ORDER_SUMMARY_QUERY_KEY,
        eventId,
        selection.ticketId,
        selection.qty,
        userToken ?? "",
      ],
      queryFn: () =>
        cartService.getOrderSummary(
          eventId as number,
          selection.ticketId,
          selection.qty,
          userToken,
        ),
      enabled: enabled && !!userToken && !!eventId && selection.qty > 0,
      staleTime: 10_000,
      retry: false,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading || q.isFetching);
  const isError = queries.some((q) => q.isError || q.data?.status !== "success");

  const summaries = queries
    .map((q) => (q.data?.status === "success" ? q.data.data : null))
    .filter((s): s is OrderSummaryData => Boolean(s));

  const lineItems: CartOrderLineItem[] = summaries.map((summary) => ({
    ticketId: summary.ticket_id,
    label: summary.ticket_type,
    qty: summary.qty,
    subtotal: summary.subtotal,
  }));

  const convenienceFee = summaries.reduce(
    (sum, s) => sum + s.platform_fee + s.gst_amount,
    0,
  );

  const subtotalSum = summaries.reduce((sum, s) => sum + s.subtotal, 0);
  const total =
    summaries.length > 0
      ? subtotalSum + convenienceFee
      : 0;

  return {
    lineItems,
    convenienceFee,
    total,
    isLoading,
    isError,
    summaries,
  };
};
