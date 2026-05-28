import axios from "axios";
import type { EventsMeta } from "@/shared/types/api";

const GARBA_PROXY_BASE = "/garba-auth";

// Garba Town exposes popular events on odoo path (confirmed in Postman).
// Keep user path as fallback in case environment differs.
const POPULAR_EVENTS_URLS = [
  import.meta.env.VITE_GARBATOWN_POPULAR_EVENTS_URL ??
    `${GARBA_PROXY_BASE}/api/v1/odoo/popular_events`,
  `${GARBA_PROXY_BASE}/api/v1/user/popular_events`,
];
const FAVORITE_EVENTS_URLS = [
  `${GARBA_PROXY_BASE}/api/v1/odoo/favourite_event`,
  `${GARBA_PROXY_BASE}/api/v1/odoo/favorite_event`,
];
let resolvedFavoriteEventsUrl: string | null = null;
let resolvedPopularEventsUrl: string | null = null;
let resolvedEventDetailsUrlTemplate: string | null = null;
let resolvedPopularHeader: Record<string, string> | null = null;
let resolvedFavoriteHeader: Record<string, string> | null = null;
let resolvedEventDetailsHeader: Record<string, string> | null = null;
let resolvedLikeHeader: Record<string, string> | null = null;

const EVENT_DETAILS_BASE_URL =
  import.meta.env.VITE_GARBATOWN_EVENT_DETAILS_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/event_details`;
const EVENT_LIKE_URL =
  import.meta.env.VITE_GARBATOWN_EVENT_LIKE_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/event_like_unlike`;

export interface PopularEvent {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
  image: string | null;
  address: string;
  organizer: string;
  booked_tickets: number;
  rating: number;
  is_like?: boolean;
  isFav?: boolean;
  attendee_count?: number;
  attendees_count?: number;
  description?: string;
  mobile?: string;
  max_tickets?: number;
  available_tickets?: number;
  organizer_image?: string;
  total_users?: number;
  attendees?: Array<{
    id?: number;
    name?: string;
    image?: string | null;
  }>;
  attachments?: Array<{
    id?: number;
    name?: string;
    mimetype?: string;
    url?: string;
  }>;
}

export interface PopularEventsResponse {
  status: string;
  message: string;
  meta: EventsMeta;
  data: PopularEvent[];
}

interface EventDetailsResponse {
  status: string;
  message?: string;
  meta?: EventsMeta;
  data?: unknown;
}

interface ToggleLikeResponse {
  status?: string;
  message?: string;
  data?: unknown;
  is_like?: boolean;
}

const buildPopularEventsHeaderVariants = (userToken?: string | null): Record<string, string>[] => {
  const tokenFromStorage = localStorage.getItem("authToken");
  const token = (userToken ?? tokenFromStorage ?? "").trim();
  const normalizedToken = token.replace(/^Bearer\s+/i, "");

  if (!normalizedToken) {
    return [];
  }

  return [
    { AuthorizationUserToken: normalizedToken },
    { AuthorizationUserToken: `Bearer ${normalizedToken}` },
    { Authorizationtoken: normalizedToken },
    { Authorizationtoken: `Bearer ${normalizedToken}` },
    { "Authorization-Token": normalizedToken },
    { "Authorization-Token": `Bearer ${normalizedToken}` },
    { Authorization: normalizedToken },
    { Authorization: `Bearer ${normalizedToken}` },
    {
      Authorization: normalizedToken,
      Authorizationtoken: normalizedToken,
    },
  ];
};

const getHeaderKey = (headers: Record<string, string>) =>
  Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key]}`)
    .join("|");

const prioritizeHeaders = (
  headers: Record<string, string>[],
  preferred: Record<string, string> | null,
) => {
  if (!preferred) return headers;
  const preferredKey = getHeaderKey(preferred);
  const unique = new Map<string, Record<string, string>>();
  [preferred, ...headers].forEach((item) => {
    const key = getHeaderKey(item);
    if (!unique.has(key)) unique.set(key, item);
  });
  return [...unique.values()].sort((a, b) => {
    const aKey = getHeaderKey(a);
    const bKey = getHeaderKey(b);
    if (aKey === preferredKey) return -1;
    if (bKey === preferredKey) return 1;
    return 0;
  });
};

const prioritizeUrls = (urls: string[], preferred: string | null) => {
  if (!preferred) return urls;
  const unique = Array.from(new Set([preferred, ...urls]));
  return unique;
};

const fetchPopularEvents = async (userToken?: string | null): Promise<PopularEventsResponse> => {
  const headerVariants = prioritizeHeaders(
    buildPopularEventsHeaderVariants(userToken),
    resolvedPopularHeader,
  );

  if (headerVariants.length === 0) {
    throw new Error("User token is required for popular events API");
  }

  let lastError: unknown = null;
  const candidateUrls = prioritizeUrls(POPULAR_EVENTS_URLS, resolvedPopularEventsUrl);

  for (const url of candidateUrls) {
    for (const headers of headerVariants) {
      try {
        const response = await axios.get<PopularEventsResponse>(url, {
          headers,
          timeout: 15000,
        });
        resolvedPopularEventsUrl = url;
        resolvedPopularHeader = headers;
        return response.data;
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        lastError = error;
        // Try next header or URL on auth / not-found / server errors
        if (status === 401 || status === 403 || status === 404 || status === 500) {
          continue;
        }
        throw error;
      }
    }
  }

  throw lastError;
};

const fetchFavoriteEvents = async (userToken?: string | null): Promise<PopularEventsResponse> => {
  // Clean behavior: derive liked events from popular_events payload
  // to avoid repeated 404 noise from unavailable favourite endpoints.
  const popular = await fetchPopularEvents(userToken);
  const likedOnly = (popular.data ?? []).filter((event) => Boolean(event.is_like));
  return {
    ...popular,
    data: likedOnly,
    meta: {
      ...popular.meta,
      total: likedOnly.length,
      count: likedOnly.length,
    },
  };
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const toString = (value: unknown, fallback = "") => {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
};

const extractFirstObject = (input: unknown): Record<string, unknown> | null => {
  if (!input) return null;
  if (Array.isArray(input)) {
    const first = input[0];
    return first && typeof first === "object" ? (first as Record<string, unknown>) : null;
  }
  if (typeof input === "object") {
    return input as Record<string, unknown>;
  }
  return null;
};

const getOrganizerLabel = (event: Record<string, unknown>) => {
  const organizer = event.organizer;
  if (typeof organizer === "string") {
    return organizer;
  }
  if (organizer && typeof organizer === "object") {
    const orgObject = organizer as Record<string, unknown>;
    return (
      toString(orgObject.name) ||
      toString(orgObject.organizer_name) ||
      toString(orgObject.title)
    );
  }
  return (
    toString(event.organizer_name) ||
    toString(event.organizerName) ||
    toString(event.organizer_title)
  );
};

const getOrganizerImage = (event: Record<string, unknown>) => {
  const organizer = event.organizer;
  if (organizer && typeof organizer === "object") {
    const orgObject = organizer as Record<string, unknown>;
    return (
      toString(orgObject.image) ||
      toString(orgObject.organizer_image) ||
      toString(orgObject.avatar)
    );
  }
  return toString(event.organizer_image) || toString(event.organizer_avatar);
};

const getAddressLabel = (event: Record<string, unknown>) => {
  return (
    toString(event.address) ||
    toString(event.venue_address) ||
    toString(event.full_address) ||
    toString(event.location) ||
    toString(event.venue)
  );
};

const normalizeEventDetails = (input: unknown, fallbackId: number): PopularEvent | undefined => {
  const payload = extractFirstObject(input);
  if (!payload) return undefined;

  const id = toNumber(payload.id, fallbackId);
  const attendeesCount = toNumber(payload.attendees_count, toNumber(payload.attendee_count, 0));
  const attachmentsRaw = Array.isArray(payload.attachments)
    ? (payload.attachments as Array<Record<string, unknown>>)
    : [];
  const attendeesRaw = Array.isArray(payload.attendees)
    ? (payload.attendees as Array<Record<string, unknown>>)
    : [];
  const attachments = attachmentsRaw.map((item) => ({
    id: toNumber(item.id, 0) || undefined,
    name: toString(item.name) || undefined,
    mimetype: toString(item.mimetype) || undefined,
    url: toString(item.url) || undefined,
  }));
  const attendees = attendeesRaw.map((item) => ({
    id: toNumber(item.id, 0) || undefined,
    name: toString(item.name) || undefined,
    image: toString(item.image) || null,
  }));
  const fallbackImage = attachments.find((item) => item.url)?.url ?? null;

  return {
    id,
    name: toString(payload.name, "Event"),
    status: toString(payload.status, "Live"),
    start_date: toString(payload.start_date),
    end_date: toString(payload.end_date),
    price: toNumber(payload.price, 0),
    image: toString(payload.image) || fallbackImage,
    address: getAddressLabel(payload),
    organizer: getOrganizerLabel(payload),
    booked_tickets: toNumber(payload.booked_tickets, 0),
    rating: toNumber(payload.rating, 0),
    attendee_count: toNumber(payload.attendee_count, attendeesCount),
    attendees_count: attendeesCount,
    description: toString(payload.description) || undefined,
    mobile: toString(payload.mobile) || undefined,
    max_tickets: toNumber(payload.max_tickets, 0) || undefined,
    available_tickets: toNumber(payload.available_tickets, 0) || undefined,
    organizer_image: getOrganizerImage(payload) || undefined,
    total_users: toNumber(payload.total_users, 0) || undefined,
    attendees,
    attachments,
    is_like: typeof payload.is_like === "boolean" ? payload.is_like : undefined,
    isFav: typeof payload.isFav === "boolean" ? payload.isFav : undefined,
  };
};

const fetchEventDetails = async (
  id: number | string,
  userToken?: string | null,
): Promise<PopularEvent | undefined> => {
  const headerVariants = prioritizeHeaders(
    buildPopularEventsHeaderVariants(userToken),
    resolvedEventDetailsHeader ?? resolvedPopularHeader,
  );
  if (headerVariants.length === 0) {
    throw new Error("User token is required for event details API");
  }

  const eventId = Number(id);
  let lastError: unknown = null;
  const normalizeToGarbaProxy = (url: string) => {
    // Prevent accidental `/api/...` requests going to wrong Vite proxy target.
    if (url.startsWith("/api/")) return `${GARBA_PROXY_BASE}${url}`;
    if (url.startsWith("api/")) return `${GARBA_PROXY_BASE}/${url}`;
    return url;
  };
  const baseCandidates = Array.from(
    new Set([
      normalizeToGarbaProxy(EVENT_DETAILS_BASE_URL),
      `${GARBA_PROXY_BASE}/api/v1/odoo/event_details`,
      `${GARBA_PROXY_BASE}/api/v1/user/event_details`,
    ]),
  );
  const rawDetailsUrlCandidates = baseCandidates.flatMap((baseUrl) => [
    `${baseUrl}/${eventId}`,
    `${baseUrl}?id=${eventId}`,
  ]);
  const detailsUrlCandidates = prioritizeUrls(
    rawDetailsUrlCandidates,
    resolvedEventDetailsUrlTemplate
      ? resolvedEventDetailsUrlTemplate.replace("{id}", String(eventId))
      : null,
  );

  for (const detailUrl of detailsUrlCandidates) {
    for (const headers of headerVariants) {
      try {
        const response = await axios.get<EventDetailsResponse>(detailUrl, {
          headers,
          timeout: 15000,
        });
        resolvedEventDetailsHeader = headers;
        if (detailUrl.includes(String(eventId))) {
          resolvedEventDetailsUrlTemplate = detailUrl.replace(String(eventId), "{id}");
        }
        return normalizeEventDetails(response.data.data, eventId);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        lastError = error;
        if (status === 404) {
          // Route not found for this URL; skip remaining header variants for same URL.
          break;
        }
        if (status === 401 || status === 403 || status === 500) {
          continue;
        }
        throw error;
      }
    }
  }

  throw lastError;
};

const parseIsLikeFromResponse = (responseData: ToggleLikeResponse, fallback: boolean) => {
  if (typeof responseData.is_like === "boolean") return responseData.is_like;
  const data = responseData.data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.is_like === "boolean") return obj.is_like;
    if (typeof obj.isLike === "boolean") return obj.isLike;
    if (typeof obj.like === "boolean") return obj.like;
  }
  const message = String(responseData.message ?? "").toLowerCase();
  if (message.includes("unlike")) return false;
  if (message.includes("liked")) return true;
  return fallback;
};

const toggleEventLikeApi = async (
  id: number | string,
  currentIsLike: boolean,
  userToken?: string | null,
): Promise<boolean> => {
  const headerVariants = prioritizeHeaders(
    buildPopularEventsHeaderVariants(userToken),
    resolvedLikeHeader,
  );
  if (headerVariants.length === 0) {
    throw new Error("User token is required for event like API");
  }

  const eventId = Number(id);
  let lastError: unknown = null;

  for (const headers of headerVariants) {
    try {
      const response = await axios.post<ToggleLikeResponse>(
        EVENT_LIKE_URL,
        { id: eventId },
        {
          headers,
          timeout: 15000,
        },
      );
      resolvedLikeHeader = headers;
      return parseIsLikeFromResponse(response.data, !currentIsLike);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      lastError = error;
      if (status === 401 || status === 403 || status === 404 || status === 405 || status === 500) {
        continue;
      }
      throw error;
    }
  }

  throw lastError;
};

export const eventService = {
  async getPopularEvents(userToken?: string | null): Promise<PopularEventsResponse> {
    return fetchPopularEvents(userToken);
  },

  async getFavoriteEvents(userToken?: string | null): Promise<PopularEventsResponse> {
    return fetchFavoriteEvents(userToken);
  },

  async getPopularEventById(
    id: number | string,
    userToken?: string | null,
  ): Promise<PopularEvent | undefined> {
    const list = await fetchPopularEvents(userToken);
    return list.data.find((event) => event.id === Number(id));
  },

  async getEventDetailsById(
    id: number | string,
    userToken?: string | null,
  ): Promise<PopularEvent | undefined> {
    try {
      return await fetchEventDetails(id, userToken);
    } catch {
      const list = await fetchPopularEvents(userToken);
      return list.data.find((event) => event.id === Number(id));
    }
  },

  async toggleEventLike(
    id: number | string,
    currentIsLike: boolean,
    userToken?: string | null,
  ): Promise<boolean> {
    return toggleEventLikeApi(id, currentIsLike, userToken);
  },
};
