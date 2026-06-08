import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";
import { FAVORITE_EVENTS_QUERY_KEY } from "@/features/events/hooks/useFavoriteEvents";
import { POPULAR_EVENTS_QUERY_KEY } from "@/features/events/hooks/usePopularEvents";
import { EVENT_DETAILS_QUERY_KEY } from "@/features/events/hooks/useEvent";

export const useEventLike = (userToken?: string | null) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      eventId,
      currentIsLike,
    }: {
      eventId: number | string;
      currentIsLike: boolean;
    }) => eventService.toggleEventLike(eventId, currentIsLike, userToken),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: FAVORITE_EVENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: EVENT_DETAILS_QUERY_KEY }),
      ]);
    },
  });

  const toggleLike = async (eventId: number | string, currentIsLike: boolean) =>
    mutation.mutateAsync({ eventId, currentIsLike });

  return {
    toggleLike,
    isUpdating: mutation.isPending,
  };
};
