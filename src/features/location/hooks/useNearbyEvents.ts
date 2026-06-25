import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/features/location/services/locationService";

export const NEARBY_EVENTS_QUERY_KEY = ["nearby-events"] as const;

export const useNearbyEvents = (
  userToken?: string | null,
  latitude?: number | null,
  longitude?: number | null,
  enabled = true,
) => {
  const hasCoords = latitude != null && longitude != null;

  return useQuery({
    queryKey: [
      ...NEARBY_EVENTS_QUERY_KEY,
      userToken ? userToken : "guest",
      hasCoords ? latitude : "saved",
      hasCoords ? longitude : "saved",
    ],
    queryFn: () =>
      locationService.getNearbyEvents(
        userToken,
        hasCoords ? latitude! : undefined,
        hasCoords ? longitude! : undefined,
      ),
    enabled: enabled && hasCoords,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
