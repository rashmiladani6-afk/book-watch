import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const useEventTypes = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ["eventTypes", params],
    queryFn: () => eventService.getEventTypes(params),
  });
};

