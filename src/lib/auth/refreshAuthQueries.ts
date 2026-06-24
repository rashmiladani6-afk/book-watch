import type { QueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { LOCAL_CART_QUERY_KEY } from "@/features/events/hooks/useLocalCart";
import { clearLocalCartEntries } from "@/features/events/utils/localCartStore";
import { EVENT_DETAILS_QUERY_KEY } from "@/features/events/hooks/useEvent";
import { FAVORITE_EVENTS_QUERY_KEY } from "@/features/events/hooks/useFavoriteEvents";
import { POPULAR_EVENTS_QUERY_KEY } from "@/features/events/hooks/usePopularEvents";
import { ORDER_SUMMARY_QUERY_KEY } from "@/features/events/hooks/useOrderSummary";
import { PROFILE_QUERY_KEY } from "@/features/auth/hooks/useProfile";
import { NEARBY_EVENTS_QUERY_KEY } from "@/features/location/hooks/useNearbyEvents";
import { MY_TICKETS_QUERY_KEY } from "@/features/tickets/hooks/useMyTickets";

export const refreshAuthQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: FAVORITE_EVENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: EVENT_DETAILS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: ORDER_SUMMARY_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: NEARBY_EVENTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: MY_TICKETS_QUERY_KEY }),
  ]);
};

export const clearAuthQueries = (queryClient: QueryClient) => {
  clearLocalCartEntries();
  queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
  queryClient.removeQueries({ queryKey: LOCAL_CART_QUERY_KEY });
  queryClient.removeQueries({ queryKey: POPULAR_EVENTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: FAVORITE_EVENTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: EVENT_DETAILS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: ORDER_SUMMARY_QUERY_KEY });
  queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
  queryClient.removeQueries({ queryKey: NEARBY_EVENTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: MY_TICKETS_QUERY_KEY });
};
