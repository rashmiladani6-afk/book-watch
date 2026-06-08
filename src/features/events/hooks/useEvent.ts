import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const EVENT_DETAILS_QUERY_KEY = ["event-details"] as const;

export const useEvent = (id?: string, userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...EVENT_DETAILS_QUERY_KEY, id, userToken ?? ""],
    queryFn: () => eventService.getEventDetailsById(id as string, userToken),
    enabled: !!id && enabled && !!userToken,
    retry: false,
  });
};
