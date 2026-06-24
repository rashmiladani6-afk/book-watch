import { useQuery } from "@tanstack/react-query";
import {
  eventService,
  type PopularEventsOptions,
} from "@/features/events/services/eventService";

export const POPULAR_EVENTS_QUERY_KEY = ["popular-events"] as const;

export const usePopularEvents = (
  userToken?: string | null,
  enabled = true,
  options?: PopularEventsOptions,
) => {
  const allowGuestBrowse = options?.allowGuestBrowse ?? true;

  return useQuery({
    queryKey: [
      ...POPULAR_EVENTS_QUERY_KEY,
      allowGuestBrowse ? "guest" : "auth",
      userToken ?? "none",
    ],
    queryFn: () => eventService.getPopularEvents(userToken, { allowGuestBrowse }),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

/** Home page: signed-in users use their token; guests fall back to browse credentials. */
export const useHomePopularEvents = (userToken?: string | null, enabled = true) =>
  usePopularEvents(userToken ?? null, enabled, { allowGuestBrowse: true });
