import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventTypes } from "@/features/events/hooks/useEventTypes";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Link } from "react-router-dom";
import { generateRoute } from "@/shared/constants/routes";

const EventsList = () => {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading, error } = useEvents({ limit: 50, offset: 0 });
  const { data: typesData } = useEventTypes({ limit: 50, offset: 0 });
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  // initialize from query param if provided (reactive)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam) setSelectedTypeId(Number(typeParam));
    else setSelectedTypeId(null);
  }, [location.search]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-lg mb-4">Please sign in to view events.</p>
          <Link to="/auth">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-destructive">
            Unable to load events. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Live Events</h1>
            <p className="text-sm text-muted-foreground">
              Fetched from Dwaaro events API (real backend data)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {typesData && (
              <select
                value={selectedTypeId ?? ""}
                onChange={(e) => setSelectedTypeId(e.target.value ? Number(e.target.value) : null)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                <option value="">All types</option>
                {typesData.data.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
            <Badge variant="outline">
              Total: {data.meta?.total ?? data.data.length}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {(data.data.filter(ev => !selectedTypeId || ev.category_id?.id === selectedTypeId)).map((event) => {
            const city = event.venue?.city || "";
            const country = event.country_id?.name || "";
            const location =
              city && country ? `${city}, ${country}` : city || country || "Online";

            const category = event.category_id?.name;
            const tags = event.tags_ids || [];

            const firstTicket = event.tickets_type?.[0];

            return (
              <Card
                key={event.id}
                className="p-4 flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  {category && (
                    <Badge variant="secondary" className="mb-1 text-xs">
                      {category}
                    </Badge>
                  )}
                  <h2 className="font-semibold text-lg line-clamp-2">
                    {event.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {event.start_date} → {event.end_date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-[10px]">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {firstTicket ? (
                      <span>
                        From <span className="font-semibold">₹{firstTicket.price}</span>
                      </span>
                    ) : (
                      <span>Pricing info coming soon</span>
                    )}
                  </div>
                  <Link to={generateRoute.eventDetail(event.id)}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventsList;


