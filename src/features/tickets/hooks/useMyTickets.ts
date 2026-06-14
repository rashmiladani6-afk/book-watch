import { useQuery } from "@tanstack/react-query";
import { ticketService } from "@/features/tickets/services/ticketService";

export const MY_TICKETS_QUERY_KEY = ["my-tickets"] as const;

export const useMyTickets = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...MY_TICKETS_QUERY_KEY, userToken ?? ""],
    queryFn: () => ticketService.getMyTickets(userToken),
    enabled: enabled && !!userToken,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
