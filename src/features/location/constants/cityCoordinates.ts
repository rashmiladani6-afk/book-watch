export interface CityCoordinates {
  latitude: number;
  longitude: number;
}

const CITY_COORDINATES: Record<string, CityCoordinates> = {
  Mumbai: { latitude: 19.076, longitude: 72.8777 },
  "Delhi-NCR": { latitude: 28.6139, longitude: 77.209 },
  Bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  Hyderabad: { latitude: 17.385, longitude: 78.4867 },
  Chandigarh: { latitude: 30.7333, longitude: 76.7794 },
  Ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
  Pune: { latitude: 18.5204, longitude: 73.8567 },
  Kolkata: { latitude: 22.5726, longitude: 88.3639 },
  Kochi: { latitude: 9.9312, longitude: 76.2673 },
  Agra: { latitude: 27.1767, longitude: 78.0081 },
  Amritsar: { latitude: 31.634, longitude: 74.8723 },
  Chennai: { latitude: 13.0827, longitude: 80.2707 },
  Goa: { latitude: 15.2993, longitude: 74.124 },
  Jaipur: { latitude: 26.9124, longitude: 75.7873 },
  Lucknow: { latitude: 26.8467, longitude: 80.9462 },
  Surat: { latitude: 21.1702, longitude: 72.8311 },
  Vadodara: { latitude: 22.3072, longitude: 73.1812 },
  Visakhapatnam: { latitude: 17.6868, longitude: 83.2185 },
  Indore: { latitude: 22.7196, longitude: 75.8577 },
  Bhopal: { latitude: 23.2599, longitude: 77.4126 },
};

const normalizeCityName = (city: string) => city.trim().replace(/\s+/g, " ");

export const getCityCoordinates = (cityName: string): CityCoordinates | null => {
  const normalized = normalizeCityName(cityName);
  return CITY_COORDINATES[normalized] ?? null;
};
