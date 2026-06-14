import axios from "axios";
import {
  buildGarbaAuthHeaderVariants,
  extractGarbaApiMessage,
} from "@/lib/garba/apiAuth";

const GARBA_PROXY_BASE = "/garba-auth";
const CART_PENDING_KEY = "cart_pending_event";
const CART_CACHE_KEY = "cart_detail_cache";

const ADD_TO_CART_URL =
  import.meta.env.VITE_GARBATOWN_ADD_TO_CART_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/add_to_cart`;
const CART_DETAILS_URLS = [
  import.meta.env.VITE_GARBATOWN_CART_DETAILS_URL ??
    `${GARBA_PROXY_BASE}/api/v1/odoo/cart_details`,
  `${GARBA_PROXY_BASE}/api/v1/odoo/cart_details`,
];
const REMOVE_CART_URL =
  import.meta.env.VITE_GARBATOWN_REMOVE_CART_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/remove_cart`;
const BUY_TICKET_URLS = [
  import.meta.env.VITE_GARBATOWN_BUY_TICKET_URL ??
    `${GARBA_PROXY_BASE}/api/v1/odoo/buy_ticket`,
];
const ORDER_SUMMARY_URL =
  import.meta.env.VITE_GARBATOWN_ORDER_SUMMARY_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/order_summary`;

let resolvedCartHeader: Record<string, string> | null = null;
let resolvedCartDetailsUrl: string | null = null;
let resolvedBuyTicketUrl: string | null = null;

const buildAuthHeaderVariants = buildGarbaAuthHeaderVariants;

const prioritizeHeaders = (
  headers: Record<string, string>[],
  preferred: Record<string, string> | null,
) => {
  if (!preferred) return headers;
  const preferredKey = JSON.stringify(preferred);
  const unique = new Map<string, Record<string, string>>();
  [preferred, ...headers].forEach((item) => {
    const key = JSON.stringify(item);
    if (!unique.has(key)) unique.set(key, item);
  });
  return [...unique.values()].sort((a, b) => {
    if (JSON.stringify(a) === preferredKey) return -1;
    if (JSON.stringify(b) === preferredKey) return 1;
    return 0;
  });
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const toString = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

export interface CartItem {
  id: number;
  event_id?: number;
  name?: string;
  event_name?: string;
  image?: string | null;
  event_image?: string | null;
  price?: number;
  qty?: number;
  sub_total?: number;
  start_date?: string;
  end_date?: string;
  address?: string;
  status?: string;
}

export interface CartDetailResponse {
  status: string;
  message?: string;
  data?: unknown;
  list?: unknown;
}

export interface AddToCartResponse {
  status: string;
  message?: string;
  popup?: boolean;
  data?: unknown;
}

export interface RemoveCartResponse {
  status: string;
  message?: string;
}

export interface BuyTicketResponse {
  status: string;
  message?: string;
  data?: unknown;
}

export interface OrderSummaryData {
  event_id: number;
  event_name: string;
  ticket_id: number;
  ticket_type: string;
  qty: number;
  price: number;
  subtotal: number;
  platform_fee: number;
  gst: number;
  gst_amount: number;
  total_amount: number;
}

const normalizeOrderSummary = (raw: unknown): OrderSummaryData | undefined => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;

  const payload = raw as Record<string, unknown>;
  const eventId = toNumber(payload.event_id, toNumber(payload.id, 0));
  const ticketId = toNumber(payload.ticket_id, 0);

  if (!eventId && !ticketId) return undefined;

  return {
    event_id: eventId,
    event_name: toString(payload.event_name) || toString(payload.name) || "Event",
    ticket_id: ticketId,
    ticket_type: toString(payload.ticket_type) || toString(payload.type) || "Ticket",
    qty: toNumber(payload.qty, 1) || 1,
    price: toNumber(payload.price, 0),
    subtotal: toNumber(payload.subtotal, toNumber(payload.sub_total, 0)),
    platform_fee: toNumber(payload.platform_fee, toNumber(payload.platform_charges, 0)),
    gst: toNumber(payload.gst, toNumber(payload.gst_percent, 0)),
    gst_amount: toNumber(payload.gst_amount, toNumber(payload.gst_value, 0)),
    total_amount: toNumber(
      payload.total_amount,
      toNumber(payload.total, toNumber(payload.grand_total, 0)),
    ),
  };
};

export interface OrderSummaryResponse {
  status: string;
  message?: string;
  data?: OrderSummaryData;
}

export interface CartEventDetail {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  price: number;
  rating?: number;
  image?: string | null;
  address?: string;
  organizer?: string;
  is_like?: boolean;
}

export interface CartTicketDetail {
  id: number;
  name: string;
  type: string;
  price: number;
  date: string;
  max_seats?: number;
  booked_tickets?: number;
  available_tickets?: number;
}

export interface FullCartDetail {
  event: CartEventDetail | null;
  tickets: CartTicketDetail[];
}

const isUserProfile = (obj: Record<string, unknown>) =>
  Boolean(obj.email || obj.email_verified_at || obj.dob_date) && !obj.event_id && !obj.event_name;

const normalizeCartItem = (raw: Record<string, unknown>): CartItem => {
  const event =
    raw.event && typeof raw.event === "object"
      ? (raw.event as Record<string, unknown>)
      : raw;

  const eventId = toNumber(raw.event_id, toNumber(event.id, toNumber(raw.id, 0)));

  return {
    id: toNumber(raw.id, eventId),
    event_id: eventId,
    name: toString(event.name) || toString(raw.name) || toString(raw.event_name),
    event_name: toString(raw.event_name) || toString(event.name),
    image: toString(event.image) || toString(raw.image) || toString(raw.event_image) || null,
    event_image: toString(raw.event_image) || toString(event.image) || null,
    price: toNumber(raw.price, toNumber(event.price, 0)),
    qty: toNumber(raw.qty, 1) || 1,
    sub_total: toNumber(raw.sub_total, toNumber(raw.price, toNumber(event.price, 0))),
    start_date: toString(raw.start_date) || toString(event.start_date),
    end_date: toString(raw.end_date) || toString(event.end_date),
    address: toString(raw.address) || toString(event.address),
    status: toString(raw.status) || toString(event.status),
  };
};

const looksLikeCartItem = (obj: Record<string, unknown>) => {
  if (isUserProfile(obj)) return false;
  return Boolean(
    obj.event_id ||
      obj.event_name ||
      (obj.name && (obj.price !== undefined || obj.sub_total !== undefined || obj.type === "event")) ||
      (obj.event && typeof obj.event === "object"),
  );
};

const extractCartItems = (payload: unknown): CartItem[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is Record<string, unknown> => item && typeof item === "object")
      .filter(looksLikeCartItem)
      .map(normalizeCartItem);
  }

  if (typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;

  if (looksLikeCartItem(obj)) {
    return [normalizeCartItem(obj)];
  }

  const arrayKeys = ["list", "items", "cart_items", "events", "cart_list", "cart_details", "data"];
  for (const key of arrayKeys) {
    if (Array.isArray(obj[key])) {
      const items = extractCartItems(obj[key]);
      if (items.length > 0) return items;
    }
  }

  if (obj.data) {
    const nested = extractCartItems(obj.data);
    if (nested.length > 0) return nested;
  }

  if (obj.cart && typeof obj.cart === "object") {
    const cartItems = extractCartItems(obj.cart);
    if (cartItems.length > 0) return cartItems;
  }

  return [];
};

const readPendingCartItem = (): CartItem | null => {
  try {
    const raw = sessionStorage.getItem(CART_PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartItem;
    if (!parsed?.event_id && !parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const savePendingCartItem = (item: CartItem) => {
  sessionStorage.setItem(CART_PENDING_KEY, JSON.stringify(item));
};

export const clearPendingCartItem = () => {
  sessionStorage.removeItem(CART_PENDING_KEY);
};

type CartDetailResult = {
  items: CartItem[];
  fullDetail: FullCartDetail;
  raw: CartDetailResponse;
};

const cacheCartDetail = (result: CartDetailResult) => {
  try {
    sessionStorage.setItem(CART_CACHE_KEY, JSON.stringify(result));
  } catch {
    // ignore quota errors
  }
};

const readCachedCartDetail = (): CartDetailResult | null => {
  try {
    const raw = sessionStorage.getItem(CART_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartDetailResult;
    if (parsed?.fullDetail?.event || (parsed?.items?.length ?? 0) > 0) {
      return parsed;
    }
  } catch {
    // ignore invalid cache
  }
  return null;
};

const clearCartDetailCache = () => {
  sessionStorage.removeItem(CART_CACHE_KEY);
};

const buildCartDetailResult = (raw: CartDetailResponse): CartDetailResult | null => {
  if (raw.status !== "success") return null;

  const fullDetail = parseFullCartDetail(raw);
  const hasCartContent = Boolean(fullDetail.event || fullDetail.tickets.length > 0);
  if (!hasCartContent) return null;

  const items = fullDetail.event
    ? [normalizeCartItem({ ...fullDetail.event, event_id: fullDetail.event.id })]
    : extractCartItems(raw.data ?? raw);

  return { items, fullDetail, raw };
};

const hydrateCartFromApi = async (
  userToken?: string | null,
): Promise<CartDetailResult | null> => {
  const headerVariants = prioritizeHeaders(
    buildGarbaAuthHeaderVariants(userToken),
    resolvedCartHeader,
  );
  if (headerVariants.length === 0) return null;

  const uniqueUrls = [...new Set(CART_DETAILS_URLS)];

  for (const url of uniqueUrls) {
    for (const headers of headerVariants) {
      try {
        const response = await axios.get<CartDetailResponse>(url, {
          headers,
          timeout: 15000,
          validateStatus: () => true,
        });

        if (response.status !== 200 || !isCartDetailPayload(response.data)) {
          continue;
        }

        const result = buildCartDetailResult(response.data);
        if (!result) continue;

        resolvedCartDetailsUrl = url;
        resolvedCartHeader = headers;
        return result;
      } catch {
        continue;
      }
    }
  }

  return null;
};

const requestWithHeaders = async <T>(
  userToken: string | null | undefined,
  requestFn: (headers: Record<string, string>) => Promise<T>,
): Promise<T> => {
  const headerVariants = prioritizeHeaders(buildAuthHeaderVariants(userToken), resolvedCartHeader);
  if (headerVariants.length === 0) {
    throw new Error("User token is required for cart API");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      const result = await requestFn(headers);
      resolvedCartHeader = headers;
      return result;
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      lastError = error;
      if (status === 401 || status === 403 || status === 404 || status === 500) {
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const normalizeCartEvent = (raw: Record<string, unknown>): CartEventDetail => ({
  id: toNumber(raw.id, 0),
  name: toString(raw.name, "Event"),
  start_date: toString(raw.start_date),
  end_date: toString(raw.end_date),
  price: toNumber(raw.price, 0),
  rating: toNumber(raw.rating, 0) || undefined,
  image: toString(raw.image) || null,
  address: toString(raw.address) || undefined,
  organizer: toString(raw.organizer) || undefined,
  is_like: typeof raw.is_like === "boolean" ? raw.is_like : undefined,
});

const normalizeCartTicket = (raw: Record<string, unknown>): CartTicketDetail => ({
  id: toNumber(raw.id, 0),
  name: toString(raw.name, "Registration"),
  type: toString(raw.type, "standard"),
  price: toNumber(raw.price, 0),
  date: toString(raw.date),
  max_seats: toNumber(raw.max_seats, 0) || undefined,
  booked_tickets: toNumber(raw.booked_tickets, 0),
  available_tickets: toNumber(raw.available_tickets, 0),
});

const parseFullCartDetail = (payload: unknown): FullCartDetail => {
  if (!payload || typeof payload !== "object") {
    return { event: null, tickets: [] };
  }

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  let event: CartEventDetail | null = null;
  if (data.event && typeof data.event === "object") {
    event = normalizeCartEvent(data.event as Record<string, unknown>);
  } else if (looksLikeCartItem(data)) {
    const item = normalizeCartItem(data);
    event = {
      id: item.event_id ?? item.id,
      name: item.name ?? item.event_name ?? "Event",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      price: item.price ?? 0,
      image: item.image ?? item.event_image ?? null,
      address: item.address,
    };
  }

  const tickets = Array.isArray(data.tickets)
    ? (data.tickets as Array<Record<string, unknown>>).map(normalizeCartTicket)
    : [];

  return { event, tickets };
};

const isCartDetailPayload = (payload: unknown): payload is CartDetailResponse =>
  Boolean(payload && typeof payload === "object" && "status" in (payload as Record<string, unknown>));

const fetchCartDetailFromApi = async (
  headers: Record<string, string>,
): Promise<CartDetailResult> => {
  const fallbackUrls = [
    ...(resolvedCartDetailsUrl ? [resolvedCartDetailsUrl] : []),
    ...CART_DETAILS_URLS.filter((url) => url !== resolvedCartDetailsUrl),
  ];
  const uniqueUrls = [...new Set(fallbackUrls)];

  for (const url of uniqueUrls) {
    try {
      const getResponse = await axios.get<CartDetailResponse>(url, {
        headers,
        timeout: 15000,
        validateStatus: () => true,
      });

      if (getResponse.status !== 200 || !isCartDetailPayload(getResponse.data)) {
        continue;
      }

      const result = buildCartDetailResult(getResponse.data);
      if (!result) continue;

      resolvedCartDetailsUrl = url;
      return result;
    } catch {
      continue;
    }
  }

  return { items: [], fullDetail: { event: null, tickets: [] }, raw: { status: "error" } };
};

export const cartService = {
  async addToCart(
    eventId: number | string,
    userToken?: string | null,
    type?: "force",
  ): Promise<AddToCartResponse> {
    const payload: { id: number; type?: string } = { id: Number(eventId) };
    if (type === "force") {
      payload.type = "force";
    }

    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.post<AddToCartResponse>(ADD_TO_CART_URL, payload, {
        headers,
        timeout: 15000,
      });
      const body = response.data;
      const popup =
        typeof body.popup === "boolean"
          ? body.popup
          : typeof (body.data as Record<string, unknown> | undefined)?.popup === "boolean"
            ? ((body.data as Record<string, unknown>).popup as boolean)
            : false;

      const itemsFromResponse = extractCartItems(body.data);
      if (itemsFromResponse.length > 0) {
        savePendingCartItem(itemsFromResponse[0]);
      } else if (body.status === "success") {
        savePendingCartItem({
          id: Number(eventId),
          event_id: Number(eventId),
        });
      }

      const hydrated = await hydrateCartFromApi(userToken);
      if (hydrated) {
        cacheCartDetail(hydrated);
        clearPendingCartItem();
      }

      return { ...body, popup };
    });
  },

  async getCartDetail(userToken?: string | null): Promise<CartDetailResult> {
    let items: CartItem[] = [];
    let fullDetail: FullCartDetail = { event: null, tickets: [] };
    let raw: CartDetailResponse = { status: "success" };

    const hydrated = await hydrateCartFromApi(userToken);
    if (hydrated) {
      cacheCartDetail(hydrated);
      clearPendingCartItem();
      return hydrated;
    }

    try {
      const result = await requestWithHeaders(userToken, async (headers) =>
        fetchCartDetailFromApi(headers),
      );
      items = result.items;
      fullDetail = result.fullDetail;
      raw = result.raw;
      if (items.length > 0 || fullDetail.event) {
        cacheCartDetail({ items, fullDetail, raw });
        clearPendingCartItem();
        return { items, fullDetail, raw };
      }
    } catch {
      // Fall through to cache / pending cart item
    }

    const cached = readCachedCartDetail();
    if (cached) {
      return cached;
    }

    if (items.length === 0) {
      const pending = readPendingCartItem();
      if (pending) {
        items = [pending];
        if (!fullDetail.event) {
          fullDetail = {
            event: {
              id: pending.event_id ?? pending.id,
              name: pending.name ?? pending.event_name ?? "Event",
              start_date: pending.start_date ?? "",
              end_date: pending.end_date ?? "",
              price: pending.price ?? 0,
              image: pending.image ?? pending.event_image ?? null,
              address: pending.address,
            },
            tickets: [],
          };
        }
      }
    }

    return { items, fullDetail, raw };
  },

  async removeCart(userToken?: string | null): Promise<RemoveCartResponse> {
    const response = await requestWithHeaders(userToken, async (headers) => {
      const res = await axios.post<RemoveCartResponse>(REMOVE_CART_URL, {}, {
        headers,
        timeout: 15000,
      });
      return res.data;
    });
    clearPendingCartItem();
    clearCartDetailCache();
    return response;
  },

  async getOrderSummary(
    eventId: number | string,
    ticketId: number | string,
    qty: number,
    userToken?: string | null,
  ): Promise<OrderSummaryResponse> {
    const normalizedQty = Math.max(1, Math.round(qty));

    try {
      const response = await requestWithHeaders(userToken, async (headers) => {
        const res = await axios.post(
          ORDER_SUMMARY_URL,
          {
            id: String(eventId),
            ticket_id: String(ticketId),
            qty: String(normalizedQty),
          },
          { headers, timeout: 15000, validateStatus: () => true },
        );
        return res;
      });

      const body = response.data as OrderSummaryResponse | Record<string, unknown>;
      const status = toString((body as OrderSummaryResponse).status, "error");
      const message = (body as OrderSummaryResponse).message;
      const normalized = normalizeOrderSummary((body as OrderSummaryResponse).data ?? body);

      if (status !== "success" || !normalized) {
        return {
          status: "error",
          message:
            message ||
            extractGarbaApiMessage({ response: { data: body, status: response.status } }) ||
            "Could not fetch order summary",
        };
      }

      return {
        status: "success",
        message,
        data: normalized,
      };
    } catch (error: unknown) {
      return {
        status: "error",
        message: extractGarbaApiMessage(error) || "Could not fetch order summary",
      };
    }
  },

  async buyTicket(
    eventId: number | string,
    ticketId: number | string,
    qty: number,
    userToken?: string | null,
  ): Promise<BuyTicketResponse> {
    const normalizedQty = Math.max(1, Math.round(qty));
    const payload = {
      id: Number(eventId),
      ticket_id: Number(ticketId),
      qty: normalizedQty,
    };

    const buyUrls = resolvedBuyTicketUrl
      ? [resolvedBuyTicketUrl, ...BUY_TICKET_URLS.filter((url) => url !== resolvedBuyTicketUrl)]
      : BUY_TICKET_URLS;

    let lastError: unknown = null;
    let lastResponse: BuyTicketResponse | null = null;

    try {
      return await requestWithHeaders(userToken, async (headers) => {
        for (const url of buyUrls) {
          try {
            const response = await axios.post<BuyTicketResponse>(url, payload, {
              headers,
              timeout: 15000,
              validateStatus: () => true,
            });

            const isHtmlError =
              typeof response.data === "string" &&
              (response.data as string).includes("<!DOCTYPE html>");

            if (response.status === 404 || isHtmlError) {
              lastResponse = {
                status: "error",
                message: "Buy ticket API is not available on the Garba Town server (404).",
              };
              continue;
            }

            if (response.data && typeof response.data === "object") {
              const body = response.data as BuyTicketResponse;
              lastResponse = body;
              if (body.status === "success") {
                resolvedBuyTicketUrl = url;
                return body;
              }
            }
          } catch (error: unknown) {
            lastError = error;
          }
        }

        if (lastResponse?.message) {
          return lastResponse;
        }

        throw lastError ?? new Error("Could not buy ticket. Please try again.");
      });
    } catch (error: unknown) {
      const message = extractGarbaApiMessage(error);
      if (message) {
        return { status: "error", message };
      }
      throw error;
    }
  },
};
