import { usePopularEvents } from "@/features/events/hooks/usePopularEvents";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import EventTrendCard from "@/features/events/components/EventTrendCard";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { brand } from "@/shared/constants/theme";

const EventsList = () => {
  const { user, session } = useAuth();
  const { data, isLoading, error, refetch, isFetching } = usePopularEvents(
    session?.access_token ?? null,
    true,
    { allowGuestBrowse: true },
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading trending events...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    const message = error instanceof Error ? error.message : "Unable to load events.";
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-10 text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: brand.text }}>
            Trending Events
          </h1>
          <p className="text-destructive">{message}</p>
          {!user && (
            <p className="text-sm text-muted-foreground">
              Guest events use browse credentials from <code>.env</code>. Set
              {" "}<code>VITE_GARBATOWN_GUEST_USER_TOKEN</code> or fix the browse password,
              then restart <code>npm run dev</code>.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              Try again
            </Button>
            {!user && (
              <Link to={getAuthUrl(ROUTES.EVENTS_LIST)}>
                <Button style={{ backgroundColor: brand.primary }} className="text-white">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const events = data.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: brand.text }}>
              Trending Events
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover Garba nights, mandal events, and passes near you
            </p>
          </div>
          <Badge variant="outline">Total: {data.meta?.total ?? events.length}</Badge>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No trending events found.</p>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventTrendCard
                key={event.id}
                event={event}
                index={index}
                userToken={session?.access_token}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventsList;
