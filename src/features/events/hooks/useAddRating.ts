import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/features/events/services/eventService";
import { POPULAR_EVENTS_QUERY_KEY } from "@/features/events/hooks/usePopularEvents";
import { EVENT_DETAILS_QUERY_KEY } from "@/features/events/hooks/useEvent";

export const useAddRating = (
  eventId?: number | string,
  userToken?: string | null,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (rating: number) => {
      if (eventId == null) {
        throw new Error("Event id is required to submit a rating");
      }
      return eventService.addEventRating(eventId, rating, userToken);
    },
    onSuccess: async (result) => {
      if (result.status !== "success") {
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: EVENT_DETAILS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY }),
      ]);
    },
  });

  return {
    submitRating: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
};
