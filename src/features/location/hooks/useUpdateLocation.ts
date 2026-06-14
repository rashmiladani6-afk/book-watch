import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/features/location/services/locationService";
import { NEARBY_EVENTS_QUERY_KEY } from "@/features/location/hooks/useNearbyEvents";

export const useUpdateLocation = (userToken?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coords: { latitude: number; longitude: number }) => {
      if (!userToken) {
        throw new Error("Sign in to update your location");
      }
      return locationService.updateLocation(userToken, coords);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NEARBY_EVENTS_QUERY_KEY });
    },
  });
};
