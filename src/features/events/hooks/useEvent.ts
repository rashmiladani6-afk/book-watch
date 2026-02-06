import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const useEvent = (id?: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id as string),
    enabled: !!id,
  });
};


