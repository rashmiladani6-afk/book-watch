import { Loader2, Ticket } from "lucide-react";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface TicketTypePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName?: string;
  tickets: EventTicketOption[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onSelectTicket: (ticket: EventTicketOption) => void;
}

const TicketTypePickerDialog = ({
  open,
  onOpenChange,
  eventName,
  tickets,
  isLoading = false,
  error = null,
  onRetry,
  onSelectTicket,
}: TicketTypePickerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8 text-xl leading-snug">
            <Ticket className="h-5 w-5 text-primary" />
            Choose ticket type
          </DialogTitle>
        </DialogHeader>

        {eventName && <p className="text-sm text-muted-foreground">{eventName}</p>}

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading ticket options…
          </div>
        ) : error ? (
          <div className="space-y-3 py-6 text-center">
            <p className="text-sm text-destructive">
              {error.message || "Could not load ticket options."}
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : tickets.length === 0 ? (
          <div className="space-y-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              You can add only one event to your cart at a time. Remove the current event
              first, then add this event.
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelectTicket(ticket)}
                className="w-full rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold capitalize">{ticket.type}</p>
                    {ticket.name !== ticket.type && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{ticket.name}</p>
                    )}
                    {typeof ticket.available_tickets === "number" && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ticket.available_tickets} available
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold">₹{ticket.price}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketTypePickerDialog;
