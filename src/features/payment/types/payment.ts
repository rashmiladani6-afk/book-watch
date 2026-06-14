import type { OrderSummaryData } from "@/features/events/services/cartService";

export interface EventPaymentState {
  type: "event";
  eventId: number;
  eventName: string;
  ticketId: number;
  ticketType: string;
  qty: number;
  orderId: string;
  paymentProviderId: string | number;
  paymentProviderName: string;
  paymentSessionId?: string;
  gatewayState?: string;
  summary?: OrderSummaryData | null;
}

export const isEventPaymentState = (value: unknown): value is EventPaymentState =>
  Boolean(
    value &&
      typeof value === "object" &&
      (value as EventPaymentState).type === "event" &&
      (value as EventPaymentState).orderId,
  );
