import axios from "axios";
import {
  buildGarbaAuthHeaderVariants,
  extractGarbaApiMessage,
  normalizeUserToken,
} from "@/lib/garba/apiAuth";
import {
  findPaymentSessionInPayload,
  isValidPaymentSessionId,
} from "@/features/payment/utils/paymentSession";
import {
  extractCreateOrderErrorCode,
  extractCreateOrderErrorMessage,
  extractCreateOrderId,
  isOrderAlreadyExistsError,
} from "@/features/payment/utils/paymentOrderErrors";

const GARBA_PROXY_BASE = "/garba-auth";
const PAYMENT_GATEWAY_URL =
  import.meta.env.VITE_GARBATOWN_PAYMENT_GATEWAY_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/payment_gateway`;
const CREATE_ORDER_URL =
  import.meta.env.VITE_GARBATOWN_CREATE_ORDER_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/create_order`;
const VERIFY_PAYMENT_URL =
  import.meta.env.VITE_GARBATOWN_VERIFY_PAYMENT_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/verify_payment`;

let resolvedPaymentHeader: Record<string, string> | null = null;

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

const requestWithHeaders = async <T>(
  userToken: string | null | undefined,
  requestFn: (headers: Record<string, string>) => Promise<T>,
): Promise<T> => {
  const headerVariants = prioritizeHeaders(
    buildGarbaAuthHeaderVariants(userToken),
    resolvedPaymentHeader,
  );
  if (headerVariants.length === 0) {
    throw new Error("User token is required for payment API");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      const result = await requestFn(headers);
      resolvedPaymentHeader = headers;
      return result;
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      lastError = error;
      if (status === 401 || status === 403) continue;
      throw error;
    }
  }
  throw lastError;
};

export interface PaymentGateway {
  id: number;
  name: string;
  code: string;
  state: string;
}

export interface PaymentGatewayResponse {
  status: string;
  message?: string;
  data?: PaymentGateway;
}

export interface CreateOrderRequest {
  eventId: number | string;
  ticketId: number | string;
  qty: number;
  paymentProviderId: number | string;
}

export interface CreateOrderData {
  order_id?: string;
  payment_session_id?: string;
}

export interface CreateOrderResponse {
  status: string;
  message?: string;
  code?: string;
  data?: CreateOrderData;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentProviderId: number | string;
}

export interface VerifyPaymentData {
  transaction_id?: string;
  status?: string;
}

export interface VerifyPaymentResponse {
  status: string;
  message?: string;
  data?: VerifyPaymentData;
}

const normalizeCreateOrderResponse = (body: unknown): CreateOrderResponse => {
  const record =
    body && typeof body === "object" ? (body as CreateOrderResponse) : ({} as CreateOrderResponse);

  const existingData =
    record.data && typeof record.data === "object" ? record.data : ({} as CreateOrderData);

  const orderId = extractCreateOrderId(body) ?? existingData.order_id;
  const paymentSessionId = findPaymentSessionInPayload(body);

  return {
    ...record,
    data: {
      ...existingData,
      order_id: orderId,
      payment_session_id: paymentSessionId,
    },
  };
};

const buildCreateOrderSuccess = (body: unknown): CreateOrderResponse | null => {
  const normalized = normalizeCreateOrderResponse(body);
  const orderId = normalized.data?.order_id;
  const paymentSessionId = normalized.data?.payment_session_id;

  if (!orderId || !paymentSessionId || !isValidPaymentSessionId(paymentSessionId)) {
    return null;
  }

  return {
    ...normalized,
    status: "success",
  };
};

export const paymentService = {
  async getPaymentGateway(userToken?: string | null): Promise<PaymentGatewayResponse> {
    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.get<PaymentGatewayResponse>(PAYMENT_GATEWAY_URL, {
        headers,
        timeout: 15000,
      });
      return response.data;
    });
  },

  async createOrder(
    data: CreateOrderRequest,
    userToken?: string | null,
  ): Promise<CreateOrderResponse> {
    const normalizedQty = Math.max(1, Math.round(data.qty));

    try {
      return await requestWithHeaders(userToken, async (headers) => {
        const response = await axios.post<CreateOrderResponse>(
          CREATE_ORDER_URL,
          {
            id: Number(data.eventId),
            ticket_id: Number(data.ticketId),
            qty: normalizedQty,
            payment_provider_id: String(data.paymentProviderId),
          },
          { headers, timeout: 30000, validateStatus: () => true },
        );

        if (response.data && typeof response.data === "object") {
          console.log("[createOrder] raw API response:", JSON.stringify(response.data));
          const rawBody = response.data as CreateOrderResponse;
          const errorMessage = extractCreateOrderErrorMessage(rawBody);
          const errorCode = extractCreateOrderErrorCode(rawBody);
          const duplicateOrder = isOrderAlreadyExistsError(rawBody, errorMessage);

          if (duplicateOrder) {
            const recovered = buildCreateOrderSuccess(rawBody);
            if (recovered) {
              return recovered;
            }
          }

          if (response.status >= 400 || rawBody.status === "error" || duplicateOrder) {
            return {
              status: "error",
              code: errorCode,
              message:
                errorMessage ||
                (duplicateOrder
                  ? "A payment order already exists. Tap Start over on the payment page or remove the cart and try again."
                  : `Create order failed (${response.status})`),
            };
          }

          const body = normalizeCreateOrderResponse(rawBody);

          if (!body.data?.order_id) {
            return {
              status: "error",
              message: body.message || "Create order did not return an order id",
            };
          }

          if (!body.data.payment_session_id) {
            return {
              status: "error",
              message:
                body.message ||
                "Order was created but Cashfree payment session is invalid. Tap Start over and try checkout again.",
            };
          }

          return {
            ...body,
            status: "success",
          };
        }

        return {
          status: "error",
          message: "Invalid response from create order API",
        };
      });
    } catch (error: unknown) {
      const message = extractGarbaApiMessage(error);
      return { status: "error", message: message ?? "Could not create order" };
    }
  },

  async verifyPayment(
    data: VerifyPaymentRequest,
    userToken?: string | null,
  ): Promise<VerifyPaymentResponse> {
    const token = normalizeUserToken(userToken);
    if (!token) {
      return { status: "error", message: "Sign in to verify payment" };
    }

    const headerVariants = prioritizeHeaders(
      buildGarbaAuthHeaderVariants(userToken),
      resolvedPaymentHeader,
    );

    let lastBody: VerifyPaymentResponse = {
      status: "error",
      message: "Could not verify payment",
    };

    for (const headers of headerVariants) {
      try {
        const response = await axios.post<VerifyPaymentResponse>(
          VERIFY_PAYMENT_URL,
          {
            order_id: data.orderId,
            payment_provider_id: String(data.paymentProviderId),
          },
          { headers, timeout: 30000, validateStatus: () => true },
        );

        resolvedPaymentHeader = headers;
        lastBody =
          response.data && typeof response.data === "object"
            ? response.data
            : lastBody;

        if (response.status !== 401 && response.status !== 403) {
          return lastBody;
        }

        if (lastBody.message?.toLowerCase().includes("invalid token")) {
          return {
            status: "error",
            message: "Your session expired. Please sign in again and retry payment.",
          };
        }
      } catch (error: unknown) {
        const message = extractGarbaApiMessage(error);
        if (message) {
          lastBody = { status: "error", message };
        }
      }
    }

    return lastBody;
  },
};
