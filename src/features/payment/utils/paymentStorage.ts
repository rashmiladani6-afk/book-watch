import type { EventPaymentState } from "@/features/payment/types/payment";
import { sanitizePaymentSessionId } from "@/features/payment/utils/paymentSession";

const PENDING_PAYMENT_KEY = "pendingEventPayment";

export const normalizeEventPaymentState = (state: EventPaymentState): EventPaymentState => ({
  ...state,
  gatewayState: state.gatewayState ?? "test",
  paymentSessionId: state.paymentSessionId
    ? sanitizePaymentSessionId(state.paymentSessionId)
    : undefined,
});

export const savePendingEventPayment = (state: EventPaymentState) => {
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(normalizeEventPaymentState(state)));
};

export const getPendingEventPayment = (): EventPaymentState | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EventPaymentState;
    if (parsed?.type === "event" && parsed.orderId) {
      return normalizeEventPaymentState(parsed);
    }
  } catch {
    // ignore invalid storage
  }
  return null;
};

export const clearPendingEventPayment = () => {
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
};
