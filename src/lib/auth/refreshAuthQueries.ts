import type { QueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { EVENT_DETAILS_QUERY_KEY } from "@/features/events/hooks/useEvent";
import { FAVORITE_EVENTS_QUERY_KEY } from "@/features/events/hooks/useFavoriteEvents";
import { POPULAR_EVENTS_QUERY_KEY } from "@/features/events/hooks/usePopularEvents";
import { ORDER_SUMMARY_QUERY_KEY } from "@/features/events/hooks/useOrderSummary";

export const refreshAuthQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: FAVORITE_EVENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: EVENT_DETAILS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: ORDER_SUMMARY_QUERY_KEY }),
  ]);
};

export const clearAuthQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
  queryClient.removeQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: FAVORITE_EVENTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: EVENT_DETAILS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: ORDER_SUMMARY_QUERY_KEY });
};
