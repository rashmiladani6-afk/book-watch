import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useSplitTicket } from "@/features/tickets/hooks/useSplitTicket";
import type { TicketItem } from "@/features/tickets/services/ticketService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SplitTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketItem | null;
  userToken?: string | null;
}

const SplitTicketDialog = ({
  open,
  onOpenChange,
  ticket,
  userToken,
}: SplitTicketDialogProps) => {
  const maxCount = Math.max(1, ticket?.qty ?? 1);
  const [contact, setContact] = useState("");
  const [ticketCount, setTicketCount] = useState(1);

  const { splitTicket, isSplitting } = useSplitTicket(userToken, {
    onSuccess: (message) => {
      toast.success(message || "Ticket split successfully");
      onOpenChange(false);
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    if (!open) return;
    setContact("");
    setTicketCount(1);
  }, [open, ticket?.id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!ticket) return;

    const email = contact.trim();
    if (!email) {
      toast.error("Enter recipient email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    const count = Math.round(Number(ticketCount));
    if (!Number.isFinite(count) || count < 1 || count > maxCount) {
      toast.error(`Enter a ticket count between 1 and ${maxCount}`);
      return;
    }

    splitTicket({
      type: "email",
      contact: email,
      ticket_count: count,
      id: ticket.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Split ticket</DialogTitle>
          <DialogDescription>
            Send {ticket?.qty && ticket.qty > 1 ? "some of your" : "a"} ticket
            {ticket?.event_name ? ` for ${ticket.event_name}` : ""} to another person by email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="split-contact">Recipient email</Label>
            <Input
              id="split-contact"
              type="email"
              placeholder="name@example.com"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              disabled={isSplitting}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="split-count">Tickets to send</Label>
            <Input
              id="split-count"
              type="number"
              min={1}
              max={maxCount}
              value={ticketCount}
              onChange={(event) => setTicketCount(Number(event.target.value))}
              disabled={isSplitting}
            />
            <p className="text-xs text-muted-foreground">
              You can send up to {maxCount} ticket{maxCount === 1 ? "" : "s"} from this order.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSplitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSplitting || !ticket}>
              {isSplitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send tickets"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SplitTicketDialog;
