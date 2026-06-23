import type { CartEventDetail, CartTicketDetail } from "@/features/events/services/cartService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import EventTicketsPanel from "@/features/events/components/EventTicketsPanel";
import { Calendar, Heart, MapPin, Star, Ticket, Users } from "lucide-react";

const getEventImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

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

interface CartDetailDialogProps {
  event: CartEventDetail | null;
  tickets: CartTicketDetail[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToken?: string | null;
}

const CartDetailDialog = ({
  event,
  tickets,
  open,
  onOpenChange,
  userToken,
}: CartDetailDialogProps) => {
  if (!event) return null;

  const imageUrl = getEventImageUrl(event.image);
  const rating = Number(event.rating ?? 0);
  const ratingDisplay = Number.isFinite(rating) ? rating.toFixed(2) : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-8 text-xl leading-snug">{event.name}</DialogTitle>
        </DialogHeader>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="h-44 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#955F3B] to-[#7a4d30] text-4xl font-bold text-white">
            {event.name.charAt(0)}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {event.is_like && (
            <Badge className="gap-1">
              <Heart className="h-3 w-3 fill-current" />
              Liked
            </Badge>
          )}
          {rating > 0 && (
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {ratingDisplay}
            </Badge>
          )}
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">Event dates</p>
              <p className="text-muted-foreground">
                {formatEventDate(event.start_date)} – {formatEventDate(event.end_date)}
              </p>
            </div>
          </div>

          {event.address && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Address</p>
                <p className="text-muted-foreground">{event.address}</p>
              </div>
            </div>
          )}

          {event.organizer && (
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Organizer</p>
                <p className="text-muted-foreground">{event.organizer}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">Base price</p>
              <p className="text-muted-foreground">
                {event.price > 0 ? `₹${event.price}` : "Free / TBA"}
              </p>
            </div>
          </div>
        </div>

        <EventTicketsPanel
          eventId={event.id}
          eventName={event.name}
          tickets={tickets}
          userToken={userToken}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CartDetailDialog;
