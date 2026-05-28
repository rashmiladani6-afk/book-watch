import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";

export const useEvent = (id?: string, userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: ["event-details", id, userToken ?? ""],
    queryFn: () => eventService.getEventDetailsById(id as string, userToken),
    enabled: !!id && enabled && !!userToken,
    retry: false,
  });
};
