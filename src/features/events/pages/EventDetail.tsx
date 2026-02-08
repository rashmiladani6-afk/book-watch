import { useParams } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Calendar, MapPin, Tag, Ticket, User } from "lucide-react";
import { useEvent } from "@/features/events/hooks/useEvent";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-destructive">Event not found.</p>
        </div>
      </div>
    );
  }

  const city = event.venue?.city || "";
  const state = event.venue?.state || "";
  const country = event.country_id?.name || "";
  const locationParts = [city, state, country].filter(Boolean);
  const location = locationParts.length ? locationParts.join(", ") : "Online";

  const category = event.category_id?.name;
  const tags = event.tags_ids || [];
  const tickets = event.tickets_type || [];
  const minPrice =
    tickets.length > 0 ? Math.min(...tickets.map((t) => t.price)) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#6D4C41] text-white">
        <div className="container max-w-5xl py-10 md:py-14">
          <div className="space-y-4 md:space-y-6">
            {category && (
              <Badge variant="outline" className="bg-white/10 border-white/30">
                {category}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {event.start_date} → {event.end_date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{event.organizer?.name}</span>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-white/15 border-white/30 text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {minPrice !== undefined && (
              <p className="text-lg md:text-xl font-semibold">
                Starting from <span className="text-yellow-300">₹{minPrice}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-8 md:py-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-[2fr,1.3fr]">
          {/* Left: About / Notes */}
          <Card className="p-5 md:p-6 space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              About the event
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {typeof event.notes === "string" && event.notes.trim().length
                ? event.notes
                : "Detailed description for this event will be available soon. Currently we show core information such as dates, venue, organizer and tickets fetched from the Dwaaro events API."}
            </p>
          </Card>

          {/* Right: Tickets */}
          <Card className="p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Tickets
              </h2>
              {minPrice !== undefined && (
                <span className="text-sm text-muted-foreground">
                  From <span className="font-semibold">₹{minPrice}</span>
                </span>
              )}
            </div>

            {tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ticket information is not available yet. Please check back later.
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between rounded-md border bg-muted/40 px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-semibold">{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {ticket.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Max seats: {ticket.maximum_seats || "Unlimited"} • Max buy:{" "}
                        {ticket.maximum_buy}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">₹{ticket.price}</p>
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full mt-2" disabled>
              Booking coming soon
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;


