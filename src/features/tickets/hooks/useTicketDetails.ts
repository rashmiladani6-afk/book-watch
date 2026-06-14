import { useQuery } from "@tanstack/react-query";
import { ticketService } from "@/features/tickets/services/ticketService";

export const ticketDetailsQueryKey = (ticketId: number | string | null, userToken?: string | null) =>
  ["ticket-details", ticketId ?? "", userToken ?? ""] as const;

export const useTicketDetails = (
  ticketId: number | string | null,
  userToken?: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ticketDetailsQueryKey(ticketId, userToken),
    queryFn: () => ticketService.getTicketDetails(ticketId!, userToken),
    enabled: enabled && !!userToken && ticketId != null,
    retry: false,
  });
};
