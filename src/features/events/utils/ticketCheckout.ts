import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";
import type { CartTicketDetail, OrderSummaryResponse } from "@/features/events/services/cartService";
import { paymentService } from "@/features/payment/services/paymentService";
import type { CreateOrderRequest } from "@/features/payment/services/paymentService";
import { ROUTES } from "@/shared/constants/routes";
import type { EventPaymentState } from "@/features/payment/types/payment";
import {
  getPendingEventPayment,
  savePendingEventPayment,
} from "@/features/payment/utils/paymentStorage";
import { isValidPaymentSessionId } from "@/features/payment/utils/paymentSession";
import {
  extractCreateOrderId,
  extractCreateOrderPaymentSessionId,
  isOrderAlreadyExistsError,
} from "@/features/payment/utils/paymentOrderErrors";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import type { CartEventDetail } from "@/features/events/services/cartService";

export interface CartTicketNavigationState {
  selectedTicketId: number;
  ticket?: EventTicketOption;
  event?: CartEventDetail;
  tickets?: EventTicketOption[];
}

export const buildCartTicketNavigationState = (
  ticket: EventTicketOption,
  event: Pick<
    CartEventDetail,
    "id" | "name" | "start_date" | "end_date" | "price" | "image" | "address" | "organizer"
  >,
  tickets: EventTicketOption[],
): CartTicketNavigationState => ({
  selectedTicketId: ticket.id,
  ticket,
  event: {
    id: event.id,
    name: event.name,
    start_date: event.start_date,
    end_date: event.end_date,
    price: event.price,
    image: event.image ?? null,
    address: event.address,
    organizer: event.organizer,
  },
  tickets,
});

interface CreateOrderResult {
  status: string;
  message?: string;
  code?: string;
  data?: {
    order_id?: string;
    payment_session_id?: string;
  };
}

const canResumePendingPayment = (
  pending: EventPaymentState,
  eventId: number,
  ticketId: number,
  qty: number,
) =>
  pending.eventId === eventId &&
  pending.ticketId === ticketId &&
  pending.qty === qty &&
  Boolean(pending.orderId) &&
  isValidPaymentSessionId(pending.paymentSessionId);

const resumePendingPayment = (
  pending: EventPaymentState,
  navigate: NavigateFunction,
): boolean => {
  savePendingEventPayment(pending);
  navigate(ROUTES.PAYMENT, { state: pending });
  toast.info("Continuing your pending payment.");
  return true;
};

const buildPaymentState = ({
  eventId,
  eventName,
  ticket,
  qty,
  orderId,
  paymentSessionId,
  gateway,
  summary,
}: {
  eventId: number;
  eventName?: string;
  ticket: Pick<CartTicketDetail, "id" | "type">;
  qty: number;
  orderId: string;
  paymentSessionId: string;
  gateway: { id: number | string; name: string; state: string };
  summary: EventPaymentState["summary"];
}): EventPaymentState => ({
  type: "event",
  eventId,
  eventName: eventName ?? summary?.event_name ?? "Event",
  ticketId: ticket.id,
  ticketType: ticket.type,
  qty,
  orderId,
  paymentProviderId: gateway.id,
  paymentProviderName: gateway.name,
  paymentSessionId,
  gatewayState: gateway.state,
  summary,
});

export interface ExecuteTicketCheckoutParams {
  userToken?: string | null;
  eventId: number;
  eventName?: string;
  ticket: Pick<CartTicketDetail, "id" | "type">;
  qty: number;
  summaryResult?: OrderSummaryResponse;
  createOrder: (data: CreateOrderRequest) => Promise<CreateOrderResult>;
  navigate: NavigateFunction;
  onUnauthorized?: () => void;
}

export const executeTicketCheckout = async ({
  userToken,
  eventId,
  eventName,
  ticket,
  qty,
  summaryResult,
  createOrder,
  navigate,
  onUnauthorized,
}: ExecuteTicketCheckoutParams): Promise<boolean> => {
  if (!userToken) {
    toast.error("Sign in to continue to payment");
    onUnauthorized?.();
    return false;
  }

  try {
    const gatewayResult = await paymentService.getPaymentGateway(userToken);
    const gateway = gatewayResult.status === "success" ? gatewayResult.data : null;
    if (!gateway?.id) {
      toast.error(gatewayResult.message || "Payment gateway is unavailable");
      return false;
    }

    const summary =
      summaryResult?.status === "success" ? summaryResult.data ?? null : null;

    const pendingPayment = getPendingEventPayment();
    if (pendingPayment && canResumePendingPayment(pendingPayment, eventId, ticket.id, qty)) {
      return resumePendingPayment(pendingPayment, navigate);
    }

    const orderResult = await createOrder({
      eventId,
      ticketId: ticket.id,
      qty,
      paymentProviderId: gateway.id,
    });

    if (orderResult.status !== "success" || !orderResult.data?.order_id) {
      if (isOrderAlreadyExistsError(orderResult, orderResult.message)) {
        const recoveredOrderId =
          orderResult.data?.order_id ?? extractCreateOrderId(orderResult) ?? pendingPayment?.orderId;
        const recoveredSessionId =
          orderResult.data?.payment_session_id ??
          extractCreateOrderPaymentSessionId(orderResult) ??
          pendingPayment?.paymentSessionId;

        if (
          recoveredOrderId &&
          recoveredSessionId &&
          isValidPaymentSessionId(recoveredSessionId)
        ) {
          const paymentState = buildPaymentState({
            eventId,
            eventName,
            ticket,
            qty,
            orderId: recoveredOrderId,
            paymentSessionId: recoveredSessionId,
            gateway,
            summary,
          });
          savePendingEventPayment(paymentState);
          navigate(ROUTES.PAYMENT, { state: paymentState });
          toast.info("Continuing your existing payment order.");
          return true;
        }

        toast.error(
          orderResult.message ||
            "A payment order already exists. Go to Payment and tap Start over, or remove the event from cart.",
        );
        return false;
      }

      toast.error(orderResult.message || "Could not create order");
      return false;
    }

    if (
      !orderResult.data.payment_session_id ||
      !isValidPaymentSessionId(orderResult.data.payment_session_id)
    ) {
      toast.error(
        orderResult.message ||
          "Server returned an invalid payment session. Go to cart, remove the event, and try again.",
      );
      return false;
    }

    const paymentState = buildPaymentState({
      eventId,
      eventName,
      ticket,
      qty,
      orderId: orderResult.data.order_id,
      paymentSessionId: orderResult.data.payment_session_id,
      gateway,
      summary,
    });

    savePendingEventPayment(paymentState);
    navigate(ROUTES.PAYMENT, { state: paymentState });
    return true;
  } catch (err: unknown) {
    const message =
      (err as { message?: string })?.message || "Checkout failed. Please try again.";
    toast.error(message);
    return false;
  }
};
