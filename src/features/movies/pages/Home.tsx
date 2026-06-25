import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import TimerCarousel from "@/shared/components/common/TimerCarousel";
import EventTrendCard, { getEventImageUrl } from "@/features/events/components/EventTrendCard";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTrendingEvents } from "@/features/events/hooks/useTrendingEvents";
import { sortByRatingThenEntries } from "@/features/events/utils/eventDisplayUtils";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { brand } from "@/shared/constants/theme";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, session, loading: authLoading } = useAuth();
  const isSignedIn = !!user && !!session?.access_token;

  const {
    events: popularEvents,
    isLoading: eventsLoading,
    isError: eventsError,
    errorMessage: eventsErrorMessage,
    refetch: refetchEvents,
    isFetching: isRefetchingEvents,
  } = useTrendingEvents(isSignedIn ? session.access_token : null, {
    includeNearby: true,
    enabled: !authLoading,
  });

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return popularEvents;
    return popularEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.address?.toLowerCase().includes(query) ||
        event.organizer?.toLowerCase().includes(query),
    );
  }, [popularEvents, searchQuery]);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weeklyEvents = filteredEvents.filter((event) => {
    if (!event.start_date) return false;
    const eventDate = new Date(event.start_date.replace(" ", "T"));
    if (Number.isNaN(eventDate.getTime())) return false;
    return eventDate >= weekStart && eventDate < weekEnd;
  });

  const topRatedEvents = sortByRatingThenEntries(
    weeklyEvents.length > 0 ? weeklyEvents : filteredEvents,
  );
  const showPopularEvents = filteredEvents.length > 0;
  const showPopularEventsLoading = authLoading || eventsLoading;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const explorePassesPath = ROUTES.PASSES;

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={setSearchQuery} />

      <TimerCarousel
        eventSlides={topRatedEvents.map((event) => ({
          id: event.id,
          title: event.name,
          image: getEventImageUrl(event.image),
          price: event.price,
          address: event.address || event.organizer,
        }))}
      />

      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: brand.text }}>
              Trending events
              <ChevronRight size={20} />
            </h2>
            <Link to={ROUTES.EVENTS_LIST}>
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>

          <div className="relative group">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
            >
              {showPopularEventsLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`trending-event-skeleton-${index}`}
                    className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-md snap-start animate-pulse"
                  >
                    <div className="h-[320px] bg-gray-100" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}

              {showPopularEvents &&
                topRatedEvents.slice(0, 10).map((event, index) => (
                  <EventTrendCard
                    key={event.id}
                    event={event}
                    index={index}
                    userToken={isSignedIn ? session.access_token : undefined}
                    variant="carousel"
                  />
                ))}

              {!showPopularEventsLoading && eventsError && (
                <div className="flex-none w-full min-w-[280px] bg-white rounded-lg shadow-md p-6 snap-start text-sm space-y-3">
                  <p className="text-red-600 font-medium">{eventsErrorMessage}</p>
                  {!isSignedIn && (
                    <>
                      <p className="text-gray-600">
                        You can browse events without signing in. Try again, or pick a city for
                        nearby events.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => refetchEvents()}
                          disabled={isRefetchingEvents}
                        >
                          Try again
                        </Button>
                        <Link to={getAuthUrl(ROUTES.HOME)}>
                          <Button size="sm" variant="secondary">
                            Sign in (optional)
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                  {isSignedIn && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refetchEvents()}
                      disabled={isRefetchingEvents}
                    >
                      Try again
                    </Button>
                  )}
                </div>
              )}

              {!showPopularEventsLoading && !eventsError && filteredEvents.length === 0 && (
                <div className="flex-none w-full min-w-[280px] bg-white rounded-lg shadow-md p-6 snap-start text-sm text-gray-600">
                  {searchQuery.trim()
                    ? "No events match your search."
                    : "No trending events available right now."}
                </div>
              )}
            </div>

            {showPopularEvents && (
              <>
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition -ml-4"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition -mr-4"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f8fafc] border-t border-gray-100">
        <div className="container text-center max-w-2xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: brand.text }}>
            Book Mandli Garba and Rataldi Garba passes in one place.
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            book&watch keeps event details, venue information, group lineups, and booking
            actions simple for every Garba night.
          </p>
          <Link to={explorePassesPath}>
            <Button style={{ backgroundColor: brand.primary }} className="hover:opacity-90 text-white">
              Explore passes
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
