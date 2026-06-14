import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const POPULAR_EVENTS_QUERY_KEY = ["popular-events"] as const;

export const usePopularEvents = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...POPULAR_EVENTS_QUERY_KEY, userToken ?? "guest"],
    queryFn: () => eventService.getPopularEvents(userToken),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
