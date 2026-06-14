import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { CartTicketDetail } from "@/features/events/services/cartService";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Minus, Plus, Ticket } from "lucide-react";
import { useOrderSummary } from "@/features/events/hooks/useOrderSummary";
import OrderSummaryPanel from "@/features/events/components/OrderSummaryPanel";
import { useCreateOrder } from "@/features/payment/hooks/useCheckout";
import { paymentService } from "@/features/payment/services/paymentService";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import type { EventPaymentState } from "@/features/payment/types/payment";
import { savePendingEventPayment } from "@/features/payment/utils/paymentStorage";

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface TicketPurchaseRowProps {
  eventId: number;
  eventName?: string;
  ticket: CartTicketDetail;
  userToken?: string | null;
  qty: number;
  maxQty: number;
  isActive: boolean;
  isCurrentBuying: boolean;
  onQtyChange: (nextQty: number) => void;
  onSelect: () => void;
  onCheckout: (summary: ReturnType<typeof useOrderSummary>["data"]) => void;
}

const TicketPurchaseRow = ({
  eventId,
  ticket,
  userToken,
  qty,
  maxQty,
  isActive,
  isCurrentBuying,
  onQtyChange,
  onSelect,
  onCheckout,
}: TicketPurchaseRowProps) => {
  const { data: summaryResult } = useOrderSummary(
    eventId,
    ticket.id,
    qty,
    userToken,
    !!userToken,
  );

  return (
    <div
      className={`rounded-lg border bg-background p-3 text-sm transition-colors ${
        isActive ? "border-primary ring-1 ring-primary/30" : ""
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold capitalize">{ticket.type}</p>
          <p className="mt-1 text-muted-foreground">{ticket.name}</p>
          <p className="mt-1 text-muted-foreground">{formatEventDate(ticket.date)}</p>
        </div>

        <div
          className="flex flex-col items-stretch gap-2 sm:items-end"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQtyChange(qty - 1)}
              disabled={qty <= 1 || isCurrentBuying}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={maxQty}
              value={qty}
              onChange={(e) => onQtyChange(Number(e.target.value))}
              className="h-8 w-14 text-center"
              disabled={isCurrentBuying}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQtyChange(qty + 1)}
              disabled={qty >= maxQty || isCurrentBuying}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            className="shrink-0"
            disabled={isCurrentBuying}
            onClick={() => onCheckout(summaryResult)}
          >
            {isCurrentBuying ? "Processing..." : "Proceed to pay"}
          </Button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Price: ₹{ticket.price}</span>
        <span>Available: {ticket.available_tickets ?? "—"}</span>
        <span>Booked: {ticket.booked_tickets ?? 0}</span>
        {ticket.max_seats !== undefined && <span>Max seats: {ticket.max_seats}</span>}
      </div>

      {isActive && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <OrderSummaryPanel
            eventId={eventId}
            ticketId={ticket.id}
            qty={qty}
            userToken={userToken}
            title="Price breakdown"
            compact
            className="rounded-md border-0 bg-muted/40 p-2 shadow-none"
          />
        </div>
      )}
    </div>
  );
};

interface EventTicketsPanelProps {
  eventId: number;
  eventName?: string;
  tickets: CartTicketDetail[];
  userToken?: string | null;
  title?: string;
  className?: string;
  quantities?: Record<number, number>;
  onQuantitiesChange?: (ticketId: number, qty: number) => void;
  activeTicketId?: number | null;
  onActiveTicketChange?: (ticketId: number) => void;
}

const EventTicketsPanel = ({
  eventId,
  eventName,
  tickets,
  userToken,
  title = "Available tickets",
  className,
  quantities: externalQuantities,
  onQuantitiesChange,
  activeTicketId: externalActiveTicketId,
  onActiveTicketChange,
}: EventTicketsPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalQuantities, setInternalQuantities] = useState<Record<number, number>>({});
  const [internalActiveTicketId, setInternalActiveTicketId] = useState<number | null>(
    tickets[0]?.id ?? null,
  );
  const [checkingOutTicketId, setCheckingOutTicketId] = useState<number | null>(null);
  const createOrder = useCreateOrder(userToken);

  const quantities = externalQuantities ?? internalQuantities;
  const activeTicketId = externalActiveTicketId ?? internalActiveTicketId;

  if (tickets.length === 0) {
    return null;
  }

  const getQty = (ticketId: number) => quantities[ticketId] ?? 1;

  const setQty = (ticketId: number, nextQty: number, maxQty?: number) => {
    const max = maxQty && maxQty > 0 ? maxQty : 10;
    const clamped = Math.min(max, Math.max(1, nextQty));
    if (onQuantitiesChange) {
      onQuantitiesChange(ticketId, clamped);
      return;
    }
    setInternalQuantities((prev) => ({ ...prev, [ticketId]: clamped }));
  };

  const setActiveTicket = (ticketId: number) => {
    if (onActiveTicketChange) {
      onActiveTicketChange(ticketId);
      return;
    }
    setInternalActiveTicketId(ticketId);
  };

  const handleCheckout = async (
    ticket: CartTicketDetail,
    qty: number,
    summaryResult: ReturnType<typeof useOrderSummary>["data"],
  ) => {
    if (!userToken) {
      toast.error("Sign in to continue to payment");
      navigate(getAuthUrl(`${location.pathname}${location.search}`));
      return;
    }

    setCheckingOutTicketId(ticket.id);
    try {
      const gatewayResult = await paymentService.getPaymentGateway(userToken);
      const gateway = gatewayResult.status === "success" ? gatewayResult.data : null;
      if (!gateway?.id) {
        toast.error(gatewayResult.message || "Payment gateway is unavailable");
        return;
      }

      const orderResult = await createOrder.mutateAsync({
        eventId,
        ticketId: ticket.id,
        qty,
        paymentProviderId: gateway.id,
      });

      if (orderResult.status !== "success" || !orderResult.data?.order_id) {
        toast.error(orderResult.message || "Could not create order");
        return;
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
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "Checkout failed. Please try again.";
      toast.error(message);
    } finally {
      setCheckingOutTicketId(null);
    }
  };

  return (
    <div className={className ?? "rounded-xl border bg-muted/30 p-4"}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Ticket className="h-4 w-4 text-primary" />
        {title}
      </p>
      <div className="space-y-3">
        {tickets.map((ticket) => {
          const qty = getQty(ticket.id);
          const maxQty =
            ticket.available_tickets && ticket.available_tickets > 0
              ? ticket.available_tickets
              : 10;
          const isCurrentBuying = checkingOutTicketId === ticket.id;

          return (
            <TicketPurchaseRow
              key={ticket.id}
              eventId={eventId}
              ticket={ticket}
              userToken={userToken}
              qty={qty}
              maxQty={maxQty}
              isActive={activeTicketId === ticket.id}
              isCurrentBuying={isCurrentBuying}
              onQtyChange={(nextQty) => setQty(ticket.id, nextQty, maxQty)}
              onSelect={() => setActiveTicket(ticket.id)}
              onCheckout={(summaryResult) => handleCheckout(ticket, qty, summaryResult)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EventTicketsPanel;
