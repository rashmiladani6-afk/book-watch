import { useHomePopularEvents } from "@/features/events/hooks/usePopularEvents";
import { useNearbyEvents } from "@/features/location/hooks/useNearbyEvents";
import { useSavedLocation } from "@/features/location/hooks/useSavedLocation";

interface UseTrendingEventsOptions {
  includeNearby?: boolean;
  enabled?: boolean;
}

export const useTrendingEvents = (
  userToken?: string | null,
  options?: UseTrendingEventsOptions,
) => {
  const enabled = options?.enabled ?? true;
  const includeNearby = options?.includeNearby ?? false;
  const { location: savedLocation, hasCoords: hasSavedCoords } = useSavedLocation();
  const useNearby = includeNearby && hasSavedCoords;

  const {
    data: popularEventsData,
    isLoading: popularEventsLoading,
    isError: popularEventsError,
    error: popularEventsErrorDetails,
    refetch: refetchPopularEvents,
    isFetching: isRefetchingPopularEvents,
  } = useHomePopularEvents(userToken, enabled);

  const {
    data: nearbyEventsData,
    isLoading: nearbyEventsLoading,
    isError: nearbyEventsError,
    refetch: refetchNearbyEvents,
    isFetching: isRefetchingNearbyEvents,
  } = useNearbyEvents(
    userToken ?? null,
    savedLocation?.latitude,
    savedLocation?.longitude,
    useNearby && enabled,
  );

  const nearbyFailed = useNearby && nearbyEventsError && !nearbyEventsLoading;
  const useNearbyData = useNearby && !nearbyFailed && Boolean(nearbyEventsData);

  const data = useNearbyData ? nearbyEventsData : popularEventsData;
  const isLoading = useNearbyData
    ? nearbyEventsLoading
    : popularEventsLoading || (useNearby && nearbyEventsLoading);
  const isError = !useNearbyData && popularEventsError && !popularEventsLoading && !isLoading;
  const errorMessage =
    popularEventsErrorDetails instanceof Error
      ? popularEventsErrorDetails.message
      : "Could not load events right now.";

  return {
    data,
    events: data?.data ?? [],
    isLoading,
    isError,
    error: popularEventsErrorDetails,
    errorMessage,
    refetch: useNearbyData ? refetchNearbyEvents : refetchPopularEvents,
    isFetching: useNearbyData ? isRefetchingNearbyEvents : isRefetchingPopularEvents,
    dataSource: useNearbyData ? ("nearby" as const) : ("popular" as const),
  };
};
