import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";
import type { CartTicketDetail, OrderSummaryResponse } from "@/features/events/services/cartService";
import { paymentService } from "@/features/payment/services/paymentService";
import type { CreateOrderRequest } from "@/features/payment/services/paymentService";
import { ROUTES } from "@/shared/constants/routes";
import type { EventPaymentState } from "@/features/payment/types/payment";
import { savePendingEventPayment } from "@/features/payment/utils/paymentStorage";
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
  data?: {
    order_id?: string;
    payment_session_id?: string;
  };
}

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

    const orderResult = await createOrder({
      eventId,
      ticketId: ticket.id,
      qty,
      paymentProviderId: gateway.id,
    });

    if (orderResult.status !== "success" || !orderResult.data?.order_id) {
      toast.error(orderResult.message || "Could not create order");
      return false;
    }

    const summary =
      summaryResult?.status === "success" ? summaryResult.data ?? null : null;

    const paymentState: EventPaymentState = {
      type: "event",
      eventId,
      eventName: eventName ?? summary?.event_name ?? "Event",
      ticketId: ticket.id,
      ticketType: ticket.type,
      qty,
      orderId: orderResult.data.order_id,
      paymentProviderId: gateway.id,
      paymentProviderName: gateway.name,
      paymentSessionId: orderResult.data.payment_session_id,
      gatewayState: gateway.state,
      summary,
    };

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
