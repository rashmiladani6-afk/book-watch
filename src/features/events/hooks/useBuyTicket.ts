import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { ORDER_SUMMARY_QUERY_KEY } from "@/features/events/hooks/useOrderSummary";
import { extractGarbaApiMessage } from "@/lib/garba/apiAuth";

interface BuyTicketVariables {
  eventId: number | string;
  ticketId: number | string;
  qty: number;
}

interface UseBuyTicketOptions {
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export const useBuyTicket = (
  userToken?: string | null,
  options?: UseBuyTicketOptions,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ eventId, ticketId, qty }: BuyTicketVariables) =>
      cartService.buyTicket(eventId, ticketId, qty, userToken),
    onSuccess: async (result) => {
      if (result.status !== "success") {
        options?.onError?.(result.message || "Could not buy ticket. Please try again.");
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ORDER_SUMMARY_QUERY_KEY }),
      ]);
      options?.onSuccess?.(result.message);
    },
    onError: (error: unknown) => {
      const message =
        extractGarbaApiMessage(error) ||
        "Could not buy ticket. Please try again.";
      options?.onError?.(message);
    },
  });

  const buyTicket = (eventId: number | string, ticketId: number | string, qty: number) =>
    mutation.mutate({ eventId, ticketId, qty });

  return {
    buyTicket,
    isBuying: mutation.isPending,
    buyingTicketId: mutation.variables?.ticketId ?? null,
  };
};
