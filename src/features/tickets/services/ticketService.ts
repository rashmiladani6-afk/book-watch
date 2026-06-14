import axios from "axios";
import { buildGarbaAuthHeaderVariants, extractGarbaApiMessage } from "@/lib/garba/apiAuth";

const GARBA_PROXY_BASE = "/garba-auth";
const MY_TICKETS_URL =
  import.meta.env.VITE_GARBATOWN_MY_TICKETS_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/my_tickets`;
const TICKET_DETAILS_URL =
  import.meta.env.VITE_GARBATOWN_TICKET_DETAILS_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/ticket_details`;
const TICKET_DOWNLOAD_URL =
  import.meta.env.VITE_GARBATOWN_TICKET_DOWNLOAD_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/ticket_download`;
const SPLIT_TICKET_URL =
  import.meta.env.VITE_GARBATOWN_SPLIT_TICKET_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/split_ticket`;

let resolvedTicketHeader: Record<string, string> | null = null;

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
  if (value == null) return fallback;
  return String(value);
};

export interface TicketItem {
  id: number;
  ticket_no?: string;
  event_name?: string;
  event_image?: string | null;
  ticket_type?: string;
  qty?: number;
  price?: number;
  total_amount?: number;
  status?: string;
  order_id?: string;
  event_date?: string;
  start_date?: string;
  end_date?: string;
  address?: string;
  transaction_id?: string;
  organizer?: string;
}

export interface MyTicketsResponse {
  status: string;
  message?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
  data: TicketItem[];
}

export interface TicketDetailsResponse {
  status: string;
  message?: string;
  data?: TicketItem;
}

export interface SplitTicketPayload {
  type: "email";
  contact: string;
  ticket_count: number;
  id: number | string;
}

export interface SplitTicketResponse {
  status: string;
  message?: string;
  data?: unknown;
}

const normalizeTicket = (raw: Record<string, unknown>): TicketItem => ({
  id: toNumber(raw.id, toNumber(raw.ticket_id, 0)),
  ticket_no: toString(raw.ticket_no) || toString(raw.ticket_number) || undefined,
  event_name: toString(raw.event_name) || toString(raw.name) || undefined,
  event_image: toString(raw.event_image) || toString(raw.image) || null,
  ticket_type: toString(raw.ticket_type) || toString(raw.type) || undefined,
  qty: toNumber(raw.qty, toNumber(raw.quantity, 0)) || undefined,
  price: toNumber(raw.price, 0) || undefined,
  total_amount: toNumber(raw.total_amount, toNumber(raw.amount, 0)) || undefined,
  status: toString(raw.status) || undefined,
  order_id: toString(raw.order_id) || undefined,
  event_date: toString(raw.event_date) || toString(raw.date) || undefined,
  start_date: toString(raw.start_date) || undefined,
  end_date: toString(raw.end_date) || undefined,
  address: toString(raw.address) || undefined,
  transaction_id: toString(raw.transaction_id) || undefined,
  organizer: toString(raw.organizer) || undefined,
});

const extractTickets = (payload: unknown): TicketItem[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is Record<string, unknown> => item && typeof item === "object")
      .map(normalizeTicket);
  }
  if (typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.data)) return extractTickets(obj.data);
  if (Array.isArray(obj.tickets)) return extractTickets(obj.tickets);
  if (Array.isArray(obj.list)) return extractTickets(obj.list);
  if (obj.id != null) return [normalizeTicket(obj)];

  return [];
};

const requestWithHeaders = async <T>(
  userToken: string | null | undefined,
  requestFn: (headers: Record<string, string>) => Promise<T>,
): Promise<T> => {
  const headerVariants = buildGarbaAuthHeaderVariants(userToken);
  if (headerVariants.length === 0) {
    throw new Error("User token is required");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      const result = await requestFn(headers);
      resolvedTicketHeader = headers;
      return result;
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) continue;
      throw error;
    }
  }
  throw lastError;
};

const getWithAuth = async <T>(
  url: string,
  userToken: string | null | undefined,
  params?: Record<string, string | number>,
): Promise<T> => {
  return requestWithHeaders(userToken, async (headers) => {
    const response = await axios.get<T>(url, {
      headers,
      params,
      timeout: 20000,
      validateStatus: () => true,
    });
    return response.data;
  });
};

const postWithAuth = async <T>(
  url: string,
  userToken: string | null | undefined,
  body: Record<string, unknown>,
): Promise<T> => {
  return requestWithHeaders(userToken, async (headers) => {
    const response = await axios.post<T>(url, body, {
      headers,
      timeout: 20000,
      validateStatus: () => true,
    });
    return response.data;
  });
};

export const ticketService = {
  async getMyTickets(userToken?: string | null): Promise<MyTicketsResponse> {
    const raw = await getWithAuth<MyTicketsResponse | { status: string; data?: unknown }>(
      MY_TICKETS_URL,
      userToken,
    );

    const tickets = extractTickets(raw);
    return {
      status: raw.status ?? "success",
      message: (raw as MyTicketsResponse).message,
      meta: (raw as MyTicketsResponse).meta,
      data: tickets,
    };
  },

  async getTicketDetails(
    ticketId: number | string,
    userToken?: string | null,
  ): Promise<TicketDetailsResponse> {
    const raw = await getWithAuth<TicketDetailsResponse>(
      TICKET_DETAILS_URL,
      userToken,
      { id: Number(ticketId) },
    );

    if (raw.data && typeof raw.data === "object") {
      return {
        ...raw,
        data: normalizeTicket(raw.data as unknown as Record<string, unknown>),
      };
    }

    return raw;
  },

  async downloadTicket(ticketId: number | string, userToken?: string | null): Promise<void> {
    const headerVariants = buildGarbaAuthHeaderVariants(userToken);
    if (headerVariants.length === 0) {
      throw new Error("User token is required");
    }

    let lastError: unknown = null;

    for (const headers of headerVariants) {
      try {
        const response = await axios.get(TICKET_DOWNLOAD_URL, {
          headers,
          params: { id: Number(ticketId) },
          responseType: "blob",
          timeout: 30000,
          validateStatus: () => true,
        });

        const contentType = response.headers["content-type"] ?? "";

        if (contentType.includes("application/json") || response.data.type?.includes("json")) {
          const text = await (response.data as Blob).text();
          const parsed = JSON.parse(text) as { message?: string; status?: string };
          throw new Error(parsed.message || "Could not download ticket");
        }

        const blob = response.data as Blob;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${ticketId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      } catch (error: unknown) {
        lastError = error;
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403) continue;
        if (error instanceof Error && error.message) throw error;
      }
    }

    throw lastError ?? new Error("Could not download ticket");
  },

  async splitTicket(
    payload: SplitTicketPayload,
    userToken?: string | null,
  ): Promise<SplitTicketResponse> {
    const normalizedCount = Math.max(1, Math.round(payload.ticket_count));
    const contact = payload.contact.trim();

    if (!contact) {
      return { status: "error", message: "Recipient email is required" };
    }

    try {
      const body = await postWithAuth<SplitTicketResponse>(SPLIT_TICKET_URL, userToken, {
        type: payload.type,
        contact,
        ticket_count: normalizedCount,
        id: String(payload.id),
      });

      const status = toString(body.status, "error");
      if (status !== "success") {
        return {
          status: "error",
          message: body.message || "Could not split ticket",
        };
      }

      return {
        status: "success",
        message: body.message,
        data: body.data,
      };
    } catch (error: unknown) {
      return {
        status: "error",
        message: extractGarbaApiMessage(error) || "Could not split ticket",
      };
    }
  },
};
