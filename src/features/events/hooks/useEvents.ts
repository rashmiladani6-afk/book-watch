import { useQuery } from "@tanstack/react-query";
import { eventService, type GetEventsParams } from "@/features/events/services/eventService";

export const useEvents = (params?: GetEventsParams) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventService.getEvents(params),
  });
};


