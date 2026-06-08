import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import TimerCarousel from "@/shared/components/common/TimerCarousel";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePopularEvents } from "@/features/events/hooks/usePopularEvents";
import type { PopularEvent } from "@/features/events/services/eventService";
import EventLikeButton from "@/features/events/components/EventLikeButton";
import { useAuth } from "@/contexts/AuthContext";
import { generateRoute, ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";

const getPopularEventImageUrl = (image: string | null | undefined) => {
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

const getEventEntryCount = (event: PopularEvent) =>
  event.attendees_count ?? event.attendee_count ?? event.booked_tickets ?? 0;

const sortByRatingThenEntries = (events: PopularEvent[]) =>
  [...events].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return getEventEntryCount(b) - getEventEntryCount(a);
  });

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, session, loading: authLoading } = useAuth();
  const {
    data: popularEventsData,
    isLoading: popularEventsLoading,
    isError: popularEventsError,
  } = usePopularEvents(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );

  const popularEvents = popularEventsData?.data ?? [];

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
  const latestAddedEvents = [...filteredEvents].sort((a, b) => Number(b.id) - Number(a.id));
  const showPopularEvents = !!user && filteredEvents.length > 0;
  const showPopularEventsLoading = !!user && popularEventsLoading;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header onSearch={setSearchQuery} />

      <TimerCarousel
        eventSlides={topRatedEvents.map((event) => ({
          id: event.id,
          title: event.name,
          image:
            getPopularEventImageUrl(event.image) ||
            "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
          subtitle: formatEventDate(event.start_date),
          badge: "Recommended",
          rating: Number(event.rating ?? 0),
        }))}
        sideEventCards={latestAddedEvents.map((event) => ({
          id: event.id,
          title: event.name,
          image:
            getPopularEventImageUrl(event.image) ||
            "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
          subtitle: formatEventDate(event.start_date),
          badge: "Latest",
          rating: Number(event.rating ?? 0),
        }))}
      />

      <section className="py-8 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Popular events
              <ChevronRight size={20} />
            </h2>
            {user && (
              <Link to="/events/list">
                <Button variant="outline" size="sm">
                  View all
                </Button>
              </Link>
            )}
          </div>

          <div className="relative group">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
            >
              {showPopularEventsLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`popular-event-skeleton-${index}`}
                    className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-md snap-start animate-pulse"
                  >
                    <div className="h-[400px] bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}

              {showPopularEvents &&
                topRatedEvents.slice(0, 10).map((event, index) => {
                  const imageUrl = getPopularEventImageUrl(event.image);

                  return (
                    <div
                      key={event.id}
                      className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 snap-start relative"
                    >
                      {index < 3 && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2 py-1 bg-[#107C10] text-white text-xs font-semibold rounded">
                            Featured
                          </span>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 z-10">
                        <EventLikeButton
                          eventId={event.id}
                          isLiked={Boolean(event.is_like)}
                          userToken={session?.access_token}
                        />
                      </div>

                      <Link to={generateRoute.eventDetail(event.id)}>
                        <div className="relative h-[400px] bg-gray-200">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={event.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] text-white text-4xl font-bold">
                              {event.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-[#3E2723] mb-1 line-clamp-2 h-10">
                            {event.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                            {event.address || event.organizer}
                          </p>
                          <p className="text-xs text-gray-400 mb-1">
                            {formatEventDate(event.start_date)}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-[#8B5E3C]">
                              {event.price ? `₹ ${event.price}` : "See details"}
                            </p>
                            {event.rating > 0 && (
                              <p className="text-xs text-gray-500">{event.rating.toFixed(1)}/5</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}

              {!authLoading && !user && (
                <div className="flex-none w-full min-w-[280px] max-w-md bg-white rounded-lg shadow-md p-6 snap-start">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in to view popular events from Garba Town.
                  </p>
                  <Link to={getAuthUrl(ROUTES.HOME)}>
                    <Button className="bg-[#8B5E3C] hover:bg-[#5C4033] text-white">
                      Sign in
                    </Button>
                  </Link>
                </div>
              )}

              {!showPopularEventsLoading && user && popularEventsError && (
                <div className="flex-none w-full min-w-[280px] bg-white rounded-lg shadow-md p-6 snap-start text-sm text-red-600">
                  Could not load popular events. Please sign out and sign in again.
                </div>
              )}

              {!showPopularEventsLoading && user && !popularEventsError && filteredEvents.length === 0 && (
                <div className="flex-none w-full min-w-[280px] bg-white rounded-lg shadow-md p-6 snap-start text-sm text-gray-600">
                  {searchQuery.trim()
                    ? "No events match your search."
                    : "No popular events available right now."}
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

      <Footer />
    </div>
  );
};

export default Home;
