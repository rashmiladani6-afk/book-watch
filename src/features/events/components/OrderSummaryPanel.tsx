import { Loader2, Receipt } from "lucide-react";
import { useOrderSummary } from "@/features/events/hooks/useOrderSummary";
import type { OrderSummaryData } from "@/features/events/services/cartService";

interface OrderSummaryPanelProps {
  eventId?: number;
  ticketId?: number | null;
  qty?: number;
  userToken?: string | null;
  ticketLabel?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

const SummaryRows = ({
  summary,
  compact,
}: {
  summary: OrderSummaryData;
  compact?: boolean;
}) => (
  <div className={compact ? "space-y-1 text-xs" : "space-y-2 text-sm"}>
    {summary.event_name && !compact && (
      <div className="flex justify-between gap-4 border-b pb-2">
        <span className="text-muted-foreground">Event</span>
        <span className="text-right font-medium">{summary.event_name}</span>
      </div>
    )}
    {summary.ticket_type && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Ticket</span>
        <span className="capitalize font-medium">{summary.ticket_type}</span>
      </div>
    )}
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Quantity</span>
      <span className="font-medium">{summary.qty}</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Price</span>
      <span className="font-medium">₹{summary.price}</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Subtotal</span>
      <span className="font-medium">₹{summary.subtotal}</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Platform fee</span>
      <span className="font-medium">₹{summary.platform_fee}</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">GST ({summary.gst}%)</span>
      <span className="font-medium">₹{summary.gst_amount}</span>
    </div>
    <div
      className={`flex justify-between gap-4 font-semibold text-foreground ${
        compact ? "mt-1 border-t pt-1" : "mt-2 border-t pt-2"
      }`}
    >
      <span>Total payable</span>
      <span>₹{summary.total_amount}</span>
    </div>
  </div>
);

const OrderSummaryPanel = ({
  eventId,
  ticketId,
  qty = 1,
  userToken,
  ticketLabel,
  title = "Order summary",
  className,
  compact = false,
}: OrderSummaryPanelProps) => {
  const { data, isLoading, isFetching, error } = useOrderSummary(
    eventId,
    ticketId,
    qty,
    userToken,
    !!userToken && !!eventId && !!ticketId,
  );

  const summary = data?.status === "success" ? data.data : null;
  const errorMessage =
    data?.status !== "success"
      ? data?.message || (error as Error)?.message
      : (error as Error)?.message;

  if (!eventId || !ticketId) {
    return (
      <div className={className ?? "rounded-2xl border bg-card p-4 text-sm text-muted-foreground"}>
        <p>Select a ticket to view order summary.</p>
      </div>
    );
  }

  return (
    <div className={className ?? "rounded-2xl border bg-card p-4 shadow-sm space-y-3"}>
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      {ticketLabel && (
        <p className="text-xs text-muted-foreground capitalize">
          Showing summary for: {ticketLabel}
        </p>
      )}

      {(isLoading || isFetching) && !summary && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching order summary...
        </div>
      )}

      {errorMessage && !summary && !isLoading && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {summary && <SummaryRows summary={summary} compact={compact} />}
    </div>
  );
};

export default OrderSummaryPanel;
