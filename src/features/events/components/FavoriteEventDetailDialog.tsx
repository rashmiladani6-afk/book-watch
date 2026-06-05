import type { PopularEvent } from "@/features/events/services/eventService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
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

interface FavoriteEventDetailDialogProps {
  event: PopularEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoriteEventDetailDialog = ({
  event,
  open,
  onOpenChange,
}: FavoriteEventDetailDialogProps) => {
  if (!event) return null;

  const imageUrl = getEventImageUrl(event.image);
  const rating = Number(event.rating ?? 0);
  const ratingDisplay = Number.isFinite(rating) ? rating.toFixed(1) : "0.0";
  const attendees = event.attendees ?? [];

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
          <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] text-4xl font-bold text-white">
            {event.name.charAt(0)}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {event.status && <Badge variant="secondary">{event.status}</Badge>}
          {event.is_like && (
            <Badge className="gap-1">
              <Heart className="h-3 w-3 fill-current" />
              Liked
            </Badge>
          )}
          {rating > 0 && (
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {ratingDisplay}/5
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
              <p className="font-medium text-foreground">Price</p>
              <p className="text-muted-foreground">
                {event.price > 0 ? `₹${event.price}` : "Free / TBA"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">Booked tickets</p>
              <p className="text-muted-foreground">{event.booked_tickets ?? 0}</p>
            </div>
          </div>

          {(event.attendees_count ?? 0) > 0 && (
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Attendees</p>
                <p className="text-muted-foreground">{event.attendees_count} people</p>
              </div>
            </div>
          )}
        </div>

        {attendees.length > 0 && (
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-semibold">Attendee list</p>
            <ul className="space-y-2">
              {attendees.map((person, index) => (
                <li
                  key={person.id ?? index}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {(person.name ?? "U").charAt(0)}
                  </span>
                  <span>{person.name ?? "Guest"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteEventDetailDialog;
