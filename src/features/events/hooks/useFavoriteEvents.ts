import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const FAVORITE_EVENTS_QUERY_KEY = ["favorite-events"] as const;

export const useFavoriteEvents = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...FAVORITE_EVENTS_QUERY_KEY, userToken ?? ""],
    queryFn: () => eventService.getFavoriteEvents(userToken),
    enabled: enabled && !!userToken,
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};
