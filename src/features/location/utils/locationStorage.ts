const SELECTED_CITY_KEY = "selectedCity";
const LOCATION_KEY = "userLocation";

export interface SavedLocation {
  city?: string;
  latitude: number;
  longitude: number;
}

const notifyLocationUpdated = () => {
  window.dispatchEvent(new Event("location-updated"));
};

export const getSavedLocation = (): SavedLocation | null => {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedLocation;
    if (
      typeof parsed.latitude === "number" &&
      typeof parsed.longitude === "number" &&
      !Number.isNaN(parsed.latitude) &&
      !Number.isNaN(parsed.longitude)
    ) {
      return parsed;
    }
  } catch {
    // ignore invalid storage
  }
  return null;
};

export const saveLocation = (location: SavedLocation) => {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  if (location.city) {
    localStorage.setItem(SELECTED_CITY_KEY, location.city);
  }
  notifyLocationUpdated();
};

export const saveCityName = (city: string) => {
  localStorage.setItem(SELECTED_CITY_KEY, city);
  notifyLocationUpdated();
};

export const getSavedCityName = (): string => {
  return localStorage.getItem(SELECTED_CITY_KEY) ?? "";
};
