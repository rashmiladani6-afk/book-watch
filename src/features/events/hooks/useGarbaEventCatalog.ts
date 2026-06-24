import { useMemo } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePopularEvents } from "@/features/events/hooks/usePopularEvents";
import {
  mapEventsToPasses,
  mapEventsToSingers,
  mapEventsToVenues,
  pickVipHeroImage,
} from "@/features/events/utils/eventCatalogMappers";

export const useGarbaEventCatalog = () => {
  const { session } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = usePopularEvents(
    session?.access_token ?? null,
    true,
    { allowGuestBrowse: true },
  );

  const events = data?.data ?? [];

  const catalog = useMemo(
    () => ({
      venues: mapEventsToVenues(events),
      passes: mapEventsToPasses(events),
      singers: mapEventsToSingers(events),
      vipHeroImage: pickVipHeroImage(events),
    }),
    [data],
  );

  return {
    ...catalog,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};
