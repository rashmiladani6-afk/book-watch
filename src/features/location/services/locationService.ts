import axios from "axios";
import { buildGarbaAuthHeaderVariants } from "@/lib/garba/apiAuth";
import {
  buildNearbyGuestEventParams,
  getWithGuestOrAuthHeaders,
  isGuestEventUser,
} from "@/lib/garba/guestEventApi";
import type { EventsMeta } from "@/shared/types/api";
import type { PopularEvent } from "@/features/events/services/eventService";

const GARBA_PROXY_BASE = "/garba-auth";
const UPDATE_LOCATION_URL =
  import.meta.env.VITE_GARBATOWN_UPDATE_LOCATION_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/update_location`;
const NEARBY_EVENTS_URL =
  import.meta.env.VITE_GARBATOWN_NEARBY_EVENTS_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/nearby_events`;

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
}

export interface UpdateLocationResponse {
  status: string;
  message?: string;
  data?: {
    latitude?: string;
    longitude?: string;
  };
}

export interface NearbyEventsResponse {
  status: string;
  message: string;
  meta: EventsMeta;
  data: PopularEvent[];
}

const postWithAuthHeaders = async <T>(
  url: string,
  userToken: string,
  payload: Record<string, unknown>,
): Promise<T> => {
  const headerVariants = buildGarbaAuthHeaderVariants(userToken);
  if (headerVariants.length === 0) {
    throw new Error("User token is required");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      const response = await axios.post<T>(url, payload, {
        headers,
        timeout: 15000,
      });
      return response.data;
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) continue;
      throw error;
    }
  }

  throw lastError;
};

export const locationService = {
  updateLocation: async (
    userToken: string,
    data: UpdateLocationRequest,
  ): Promise<UpdateLocationResponse> => {
    return postWithAuthHeaders<UpdateLocationResponse>(UPDATE_LOCATION_URL, userToken, {
      latitude: String(data.latitude),
      longitude: String(data.longitude),
    });
  },

  getNearbyEvents: async (
    userToken?: string | null,
    latitude?: number,
    longitude?: number,
  ): Promise<NearbyEventsResponse> => {
    if (latitude == null || longitude == null) {
      throw new Error("Location is required for nearby events.");
    }

    const guestOptions = { skipStoredToken: !userToken };
    const isGuest = isGuestEventUser(userToken, guestOptions);

    const params = isGuest
      ? buildNearbyGuestEventParams(latitude, longitude, { limit: 10 })
      : {
          latitude: String(latitude),
          longitude: String(longitude),
        };

    const data = await getWithGuestOrAuthHeaders<NearbyEventsResponse>(
      NEARBY_EVENTS_URL,
      userToken ?? null,
      params,
      guestOptions,
    );

    if (data?.status === "error") {
      throw new Error(data.message || "Could not load nearby events.");
    }

    return data;
  },
};
