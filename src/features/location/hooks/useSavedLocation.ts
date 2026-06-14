import { useEffect, useState } from "react";
import {
  getSavedCityName,
  getSavedLocation,
  type SavedLocation,
} from "@/features/location/utils/locationStorage";

export const LOCATION_UPDATED_EVENT = "location-updated";

export const useSavedLocation = () => {
  const [location, setLocation] = useState<SavedLocation | null>(() => getSavedLocation());
  const [city, setCity] = useState(() => getSavedCityName());

  useEffect(() => {
    const sync = () => {
      setLocation(getSavedLocation());
      setCity(getSavedCityName());
    };

    window.addEventListener(LOCATION_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LOCATION_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { location, city, hasCoords: !!(location?.latitude && location?.longitude) };
};
