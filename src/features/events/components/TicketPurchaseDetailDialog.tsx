import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Ticket } from "lucide-react";
import type { CartEventDetail } from "@/features/events/services/cartService";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import { eventTicketToCartTicket } from "@/features/events/types/eventTickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import OrderSummaryPanel from "@/features/events/components/OrderSummaryPanel";
import { useOrderSummary } from "@/features/events/hooks/useOrderSummary";
import { useCreateOrder } from "@/features/payment/hooks/useCheckout";
import { executeTicketCheckout } from "@/features/events/utils/ticketCheckout";
import { getAuthUrl } from "@/lib/auth/authRedirect";

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

interface TicketPurchaseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CartEventDetail;
  ticket: EventTicketOption | null;
  userToken?: string | null;
  onBack?: () => void;
}

const TicketPurchaseDetailDialog = ({
  open,
  onOpenChange,
  event,
  ticket,
  userToken,
  onBack,
}: TicketPurchaseDetailDialogProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const createOrder = useCreateOrder(userToken);
  const [qty, setQty] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (open) setQty(1);
  }, [open, ticket?.id]);

  if (!ticket) return null;

  const maxQty =
    ticket.available_tickets && ticket.available_tickets > 0
      ? ticket.available_tickets
      : 10;

  const { data: summaryResult } = useOrderSummary(
    event.id,
    ticket.id,
    qty,
    userToken,
    open && !!userToken,
  );

  const handleProceedToPay = async () => {
    setIsCheckingOut(true);
    try {
      await executeTicketCheckout({
        userToken,
        eventId: event.id,
        eventName: event.name,
        ticket: eventTicketToCartTicket(ticket),
        qty,
        summaryResult,
        createOrder: createOrder.mutateAsync,
        navigate,
        onUnauthorized: () => navigate(getAuthUrl(`${location.pathname}${location.search}`)),
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8 text-xl leading-snug">
            <Ticket className="h-5 w-5 text-primary" />
            Buy tickets
          </DialogTitle>
        </DialogHeader>

        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-mt-2 w-fit px-0 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to ticket types
          </Button>
        )}

        <div className="rounded-xl border bg-card p-4 text-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-base font-semibold capitalize">{ticket.type}</p>
              <p className="mt-1 text-muted-foreground">{ticket.name}</p>
              <p className="mt-1 text-muted-foreground">{formatEventDate(ticket.date ?? "")}</p>
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  disabled={qty <= 1 || isCheckingOut}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={qty}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (!Number.isFinite(next)) return;
                    setQty(Math.min(maxQty, Math.max(1, next)));
                  }}
                  className="h-8 w-14 text-center"
                  disabled={isCheckingOut}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQty((current) => Math.min(maxQty, current + 1))}
                  disabled={qty >= maxQty || isCheckingOut}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="sm"
                className="shrink-0 bg-[#955F3B] hover:bg-[#7a4d30]"
                disabled={isCheckingOut}
                onClick={handleProceedToPay}
              >
                {isCheckingOut ? "Processing..." : "Proceed to pay"}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Price: ₹{ticket.price}</span>
            <span>Available: {ticket.available_tickets ?? "—"}</span>
            <span>Booked: {ticket.booked_tickets ?? 0}</span>
            {ticket.max_seats !== undefined && <span>Max seats: {ticket.max_seats}</span>}
          </div>
        </div>

        <OrderSummaryPanel
          eventId={event.id}
          ticketId={ticket.id}
          qty={qty}
          userToken={userToken}
          title="Price breakdown"
          compact
          className="rounded-md border bg-muted/40 p-3 shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
};

export default TicketPurchaseDetailDialog;
