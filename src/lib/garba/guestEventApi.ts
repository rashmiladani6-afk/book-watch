import axios from "axios";
import {
  buildGarbaAuthHeaderVariants,
  buildGarbaServiceBearerHeaders,
  normalizeUserToken,
} from "@/lib/garba/apiAuth";

export interface GuestEventListParamsOptions {
  search?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
}

export const isGuestEventUser = (
  userToken?: string | null,
  options?: { skipStoredToken?: boolean },
): boolean => {
  const token = options?.skipStoredToken
    ? (userToken ?? "").trim().replace(/^Bearer\s+/i, "")
    : normalizeUserToken(userToken);
  return !token;
};

export const buildGuestEventHeaders = () => buildGarbaServiceBearerHeaders();

export const buildGuestEventListParams = (
  options: GuestEventListParamsOptions = {},
): Record<string, string> => {
  const params: Record<string, string> = {
    search: options.search ?? "",
    limit: String(options.limit ?? 10),
    offset: String(options.offset ?? 0),
    sort: options.sort ?? "",
    is_guest_user: "true",
  };

  if (options.type) {
    params.type = options.type;
  }

  if (options.latitude != null && options.longitude != null) {
    params.latitude = String(options.latitude);
    params.longitude = String(options.longitude);
  }

  return params;
};

export const buildNearbyGuestEventParams = (
  latitude: number,
  longitude: number,
  options?: Omit<GuestEventListParamsOptions, "latitude" | "longitude" | "type">,
) =>
  buildGuestEventListParams({
    ...options,
    type: "near_by",
    latitude,
    longitude,
  });

export const buildPopularGuestEventParams = (
  options?: Pick<GuestEventListParamsOptions, "limit" | "offset">,
) => ({
  limit: String(options?.limit ?? 10),
  offset: String(options?.offset ?? 0),
  is_guest_user: "true",
});

export const buildGuestEventDetailParams = () => ({ is_guest_user: "true" });

export const getWithGuestOrAuthHeaders = async <T>(
  url: string,
  userToken: string | null | undefined,
  params: Record<string, string> | undefined,
  options?: { skipStoredToken?: boolean },
): Promise<T> => {
  const guest = isGuestEventUser(userToken, options);

  if (guest) {
    const response = await axios.get<T>(url, {
      headers: buildGuestEventHeaders(),
      params,
      timeout: 15000,
    });
    return response.data;
  }

  const headerVariants = buildGarbaAuthHeaderVariants(userToken);
  if (headerVariants.length === 0) {
    throw new Error("User token is required");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      const response = await axios.get<T>(url, {
        headers,
        params,
        timeout: 15000,
      });
      return response.data;
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403 || status === 404 || status === 500) {
        continue;
      }
      throw error;
    }
  }

  throw lastError;
};
