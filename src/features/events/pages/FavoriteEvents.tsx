import { useFavoriteEvents } from "@/features/events/hooks/useFavoriteEvents";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Link } from "react-router-dom";
import { generateRoute } from "@/shared/constants/routes";

const getEventImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const FavoriteEvents = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { data, isLoading, error } = useFavoriteEvents(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );

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
          <p className="text-lg mb-4">Please sign in to view liked events.</p>
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
          <p className="text-center text-muted-foreground">Loading liked events...</p>
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
            Unable to load liked events. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const events = data.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Liked Events</h1>
            <p className="text-sm text-muted-foreground">
              Events you have liked from Garba Town
            </p>
          </div>
          <Badge variant="outline">
            Total: {data.meta?.total ?? events.length}
          </Badge>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No liked events found.</p>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const imageUrl = getEventImageUrl(event.image);

              return (
                <Card
                  key={event.id}
                  className="overflow-hidden flex flex-col h-full"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={event.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] flex items-center justify-center text-white text-3xl font-bold">
                      {event.name.charAt(0)}
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div className="space-y-2">
                      {event.status && (
                        <Badge variant="secondary" className="text-xs">
                          {event.status}
                        </Badge>
                      )}
                      <h2 className="font-semibold text-lg line-clamp-2">
                        {event.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {formatEventDate(event.start_date)} → {formatEventDate(event.end_date)}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.address || event.organizer || "Event"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        {event.price ? (
                          <span>
                            From <span className="font-semibold">₹{event.price}</span>
                          </span>
                        ) : (
                          <span>See details</span>
                        )}
                      </div>
                      <Link to={generateRoute.eventDetail(event.id)}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FavoriteEvents;
