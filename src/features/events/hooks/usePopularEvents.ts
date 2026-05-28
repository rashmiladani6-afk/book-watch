import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const usePopularEvents = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: ["popular-events", userToken ?? ""],
    queryFn: () => eventService.getPopularEvents(userToken),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
