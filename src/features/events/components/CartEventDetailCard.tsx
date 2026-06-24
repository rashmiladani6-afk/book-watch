import { CreditCard, Loader2, Minus, Plus, Ticket, Trash2 } from "lucide-react";
import type { CartEventDetail } from "@/features/events/services/cartService";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useCartOrderTotals } from "@/features/events/hooks/useCartOrderTotals";
import EventMetaRows from "@/features/events/components/EventMetaRows";

interface CartEventDetailCardProps {
  event: CartEventDetail;
  imageUrl: string | null;
  tickets: EventTicketOption[];
  quantities: Record<number, number>;
  userToken?: string | null;
  isCheckingOut?: boolean;
  onQtyChange: (ticketId: number, qty: number) => void;
  onBuyTickets: () => void;
  onAddTicketType?: () => void;
  onRemove: () => void;
  isRemoving?: boolean;
}

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const CartEventDetailCard = ({
  event,
  imageUrl,
  tickets,
  quantities,
  userToken,
  isCheckingOut = false,
  onQtyChange,
  onBuyTickets,
  onAddTicketType,
  onRemove,
  isRemoving = false,
}: CartEventDetailCardProps) => {
  const selectedTickets = tickets.filter((ticket) => (quantities[ticket.id] ?? 0) > 0);
  const selectedCount = selectedTickets.length;
  const hasMoreTicketTypes = tickets.some((ticket) => (quantities[ticket.id] ?? 0) === 0);

  const selections = selectedTickets.map((ticket) => ({
    ticketId: ticket.id,
    qty: quantities[ticket.id] ?? 1,
    label: ticket.type,
  }));

  const { lineItems, convenienceFee, total, isLoading: summaryLoading } = useCartOrderTotals(
    event.id,
    selections,
    userToken,
    selectedCount > 0,
  );

  const getMaxQty = (ticket: EventTicketOption) =>
    ticket.available_tickets && ticket.available_tickets > 0 ? ticket.available_tickets : 10;

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
            {imageUrl ? (
              <img src={imageUrl} alt={event.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#955F3B] to-[#7a4d30] text-2xl font-bold text-white">
                {event.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold leading-snug sm:text-xl">{event.name}</h2>
              <Badge className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                ✓ Added to cart
              </Badge>
            </div>

            <EventMetaRows
              className="mt-3"
              startDate={event.start_date}
              endDate={event.end_date}
              address={event.address}
              organizer={event.organizer}
              ticketSummary={
                selectedCount > 0
                  ? `${selectedCount} ticket type${selectedCount > 1 ? "s" : ""} selected`
                  : undefined
              }
            />
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Selected tickets
              </p>
              {onAddTicketType && hasMoreTicketTypes && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-[#955F3B] hover:text-[#7a4d30]"
                  onClick={onAddTicketType}
                  disabled={isCheckingOut || isRemoving}
                >
                  + Add ticket type
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {selectedTickets.map((ticket) => {
                const qty = quantities[ticket.id] ?? 1;
                const maxQty = getMaxQty(ticket);

                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col gap-3 border-b border-dashed pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold capitalize">{ticket.type}</p>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {ticket.name}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ticket.available_tickets ?? "—"} available
                        {event.organizer ? ` · ${event.organizer}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onQtyChange(ticket.id, qty - 1)}
                          disabled={qty <= 0 || isCheckingOut}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{qty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onQtyChange(ticket.id, qty + 1)}
                          disabled={qty >= maxQty || isCheckingOut}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="min-w-[4.5rem] text-right font-semibold text-[#955F3B]">
                        {formatCurrency(ticket.price * qty)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="mt-6 rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Order summary
            </p>

            {summaryLoading ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating total...
              </div>
            ) : (
              <div className="mt-3 space-y-2 text-sm">
                {lineItems.map((item) => (
                  <div key={item.ticketId} className="flex justify-between gap-4">
                    <span className="capitalize text-muted-foreground">
                      {item.label} × {item.qty}
                    </span>
                    <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
                {convenienceFee > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Convenience fee</span>
                    <span className="font-medium">{formatCurrency(convenienceFee)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-xl text-[#955F3B]">{formatCurrency(total)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedCount === 0 && tickets.length > 0 && (
          <div className="mt-6 rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center">
            <Ticket className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No ticket types selected yet. Choose ticket types to continue.
            </p>
            {onAddTicketType && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-[#955F3B] text-[#955F3B] hover:bg-[#955F3B]/10"
                onClick={onAddTicketType}
                disabled={isCheckingOut || isRemoving}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Choose ticket types
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t bg-muted/20 p-4 sm:flex-row">
        {onAddTicketType && hasMoreTicketTypes && selectedCount > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#955F3B] text-[#955F3B] hover:bg-[#955F3B]/10"
            onClick={onAddTicketType}
            disabled={isCheckingOut || isRemoving}
          >
            <Ticket className="mr-2 h-4 w-4" />
            Add ticket type
          </Button>
        )}
        <Button
          className="flex-1 bg-[#955F3B] hover:bg-[#7a4d30]"
          onClick={onBuyTickets}
          disabled={isCheckingOut || isRemoving}
        >
          {selectedCount > 0 ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {isCheckingOut ? "Processing..." : "Buy tickets"}
            </>
          ) : (
            <>
              <Ticket className="mr-2 h-4 w-4" />
              Choose ticket types
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="sm:w-auto"
          onClick={onRemove}
          disabled={isRemoving || isCheckingOut}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isRemoving ? "Removing..." : "Remove"}
        </Button>
      </div>
    </article>
  );
};

export default CartEventDetailCard;
