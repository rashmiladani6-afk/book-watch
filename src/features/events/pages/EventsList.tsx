import { useMemo } from "react";
import { useTrendingEvents } from "@/features/events/hooks/useTrendingEvents";
import { sortByRatingThenEntries } from "@/features/events/utils/eventDisplayUtils";
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

const EventGridSkeleton = () => (
  <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`event-skeleton-${index}`}
        className="overflow-hidden rounded-lg bg-white shadow-md animate-pulse"
      >
        <div className="aspect-[3/4] bg-gray-200" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const EventsList = () => {
  const { user, session, loading: authLoading } = useAuth();
  const isSignedIn = !!user && !!session?.access_token;
  const {
    data,
    events,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isFetching,
    dataSource,
  } = useTrendingEvents(isSignedIn ? session.access_token : null, {
    includeNearby: true,
    enabled: !authLoading,
  });

  const sortedEvents = useMemo(() => sortByRatingThenEntries(events), [events]);
  const showLoading = authLoading || isLoading;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: brand.text }}>
              All Events
            </h1>
            <p className="text-sm text-muted-foreground">
              {dataSource === "nearby"
                ? "Events near you"
                : "Discover Garba nights, mandal events, and passes near you"}
            </p>
          </div>
          {!showLoading && !isError && data && (
            <Badge variant="outline">Total: {data.meta?.total ?? sortedEvents.length}</Badge>
          )}
        </div>

        {showLoading && <EventGridSkeleton />}

        {!showLoading && isError && (
          <div className="rounded-lg border bg-card p-6 text-sm space-y-3 max-w-xl">
            <p className="text-destructive font-medium">{errorMessage}</p>
            {!isSignedIn && (
              <p className="text-muted-foreground">
                You can browse events without signing in. Try again, or pick a city for nearby
                events.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
                Try again
              </Button>
              {!isSignedIn && (
                <Link to={getAuthUrl(ROUTES.EVENTS_LIST)}>
                  <Button size="sm" variant="secondary">
                    Sign in (optional)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {!showLoading && !isError && sortedEvents.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No trending events found.</p>
        )}

        {!showLoading && !isError && sortedEvents.length > 0 && (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event, index) => (
              <EventTrendCard
                key={event.id}
                event={event}
                index={index}
                userToken={isSignedIn ? session.access_token : undefined}
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
