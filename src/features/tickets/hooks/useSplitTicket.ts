import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ticketService,
  type SplitTicketPayload,
} from "@/features/tickets/services/ticketService";
import { MY_TICKETS_QUERY_KEY } from "@/features/tickets/hooks/useMyTickets";

interface UseSplitTicketOptions {
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export const useSplitTicket = (
  userToken?: string | null,
  options?: UseSplitTicketOptions,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SplitTicketPayload) =>
      ticketService.splitTicket(payload, userToken),
    onSuccess: async (result) => {
      if (result.status !== "success") {
        options?.onError?.(result.message || "Could not split ticket. Please try again.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: MY_TICKETS_QUERY_KEY });
      options?.onSuccess?.(result.message);
    },
    onError: () => {
      options?.onError?.("Could not split ticket. Please try again.");
    },
  });

  return {
    splitTicket: mutation.mutate,
    isSplitting: mutation.isPending,
  };
};
