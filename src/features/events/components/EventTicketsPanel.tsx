import { useState } from "react";
import { toast } from "sonner";
import type { CartTicketDetail } from "@/features/events/services/cartService";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Minus, Plus, Ticket } from "lucide-react";
import { useBuyTicket } from "@/features/events/hooks/useBuyTicket";
import { useOrderSummary } from "@/features/events/hooks/useOrderSummary";

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
  ticket: CartTicketDetail;
  userToken?: string | null;
  qty: number;
  maxQty: number;
  isCurrentBuying: boolean;
  onQtyChange: (nextQty: number) => void;
  onBuy: () => void;
}

const TicketPurchaseRow = ({
  eventId,
  ticket,
  userToken,
  qty,
  maxQty,
  isCurrentBuying,
  onQtyChange,
  onBuy,
}: TicketPurchaseRowProps) => {
  const { data: summaryResult } = useOrderSummary(
    eventId,
    ticket.id,
    qty,
    userToken,
    !!userToken,
  );
  const summary = summaryResult?.status === "success" ? summaryResult.data : null;

  return (
    <div className="rounded-lg border bg-background p-3 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold capitalize">{ticket.type}</p>
          <p className="mt-1 text-muted-foreground">{ticket.name}</p>
          <p className="mt-1 text-muted-foreground">{formatEventDate(ticket.date)}</p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
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
            onClick={onBuy}
          >
            {isCurrentBuying ? "Buying..." : "Buy ticket"}
          </Button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Price: ₹{ticket.price}</span>
        <span>Available: {ticket.available_tickets ?? "—"}</span>
        <span>Booked: {ticket.booked_tickets ?? 0}</span>
        {ticket.max_seats !== undefined && <span>Max seats: {ticket.max_seats}</span>}
      </div>

      {summary && (
        <div className="mt-3 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{summary.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform fee</span>
            <span>₹{summary.platform_fee}</span>
          </div>
          <div className="flex justify-between">
            <span>GST ({summary.gst}%)</span>
            <span>₹{summary.gst_amount}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-foreground">
            <span>Total payable</span>
            <span>₹{summary.total_amount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface EventTicketsPanelProps {
  eventId: number;
  tickets: CartTicketDetail[];
  userToken?: string | null;
  title?: string;
  className?: string;
}

const EventTicketsPanel = ({
  eventId,
  tickets,
  userToken,
  title = "Available tickets",
  className,
}: EventTicketsPanelProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { buyTicket, isBuying, buyingTicketId } = useBuyTicket(userToken, {
    onSuccess: (message) => {
      toast.success(message || "Ticket purchased successfully");
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  if (tickets.length === 0) {
    return null;
  }

  const getQty = (ticketId: number) => quantities[ticketId] ?? 1;

  const setQty = (ticketId: number, nextQty: number, maxQty?: number) => {
    const max = maxQty && maxQty > 0 ? maxQty : 10;
    const clamped = Math.min(max, Math.max(1, nextQty));
    setQuantities((prev) => ({ ...prev, [ticketId]: clamped }));
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
          const isCurrentBuying = isBuying && Number(buyingTicketId) === ticket.id;

          return (
            <TicketPurchaseRow
              key={ticket.id}
              eventId={eventId}
              ticket={ticket}
              userToken={userToken}
              qty={qty}
              maxQty={maxQty}
              isCurrentBuying={isCurrentBuying}
              onQtyChange={(nextQty) => setQty(ticket.id, nextQty, maxQty)}
              onBuy={() => buyTicket(eventId, ticket.id, qty)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EventTicketsPanel;
