import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Play, Share2, Star, ThumbsUp, X } from "lucide-react";
import { useEvent } from "@/features/events/hooks/useEvent";
import { eventService } from "@/features/events/services/eventService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const getEventImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getEventDuration = (start: string, end: string) => {
  const startDate = new Date(start.replace(" ", "T"));
  const endDate = new Date(end.replace(" ", "T"));
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;

  const diffMs = Math.max(endDate.getTime() - startDate.getTime(), 0);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0 && hours > 0) return `${days}d ${hours}h`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours}h`;
  return null;
};

const formatVoteCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
};

const normalizeAddress = (address?: string | null) => {
  if (!address) return "";
  return address
    .replace(/,\s*,+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*$/g, "")
    .trim();
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, session, loading: authLoading } = useAuth();
  const { data: event, isLoading, error } = useEvent(
    id,
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeUpdating, setIsLikeUpdating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isTrailerOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTrailerOpen]);

  useEffect(() => {
    setIsLiked(Boolean(event?.is_like));
  }, [event?.is_like]);

  const handleLikeToggle = async () => {
    if (!event?.id) return;
    setIsLikeUpdating(true);
    try {
      const updatedLike = await eventService.toggleEventLike(
        event.id,
        isLiked,
        session?.access_token,
      );
      setIsLiked(updatedLike);
      toast.success(updatedLike ? "Added to liked events" : "Removed from liked events");
    } catch {
      toast.error("Could not update like status. Please try again.");
    } finally {
      setIsLikeUpdating(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-lg mb-4">Please sign in to view event details.</p>
          <Link to="/auth">
            <Button>Sign in</Button>
          </Link>
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

  const imageUrl = getEventImageUrl(event.image);
  const heroBackground = imageUrl ?? undefined;
  const ratingValue = Number(event.rating ?? 0);
  const ratingDisplay = Number.isFinite(ratingValue) ? ratingValue.toFixed(1) : "0.0";
  const duration = getEventDuration(event.start_date, event.end_date);
  const tags = [event.status, "Live Event"].filter(Boolean);
  const venueAddress = normalizeAddress(event.address) || "Venue TBA";
  const attachmentImages = (event.attachments ?? [])
    .map((item) => getEventImageUrl(item.url))
    .filter((url): url is string => Boolean(url));
  const selectedPhotoIndex = selectedPhoto ? attachmentImages.indexOf(selectedPhoto) : -1;

  const showNextPhoto = () => {
    if (attachmentImages.length === 0 || selectedPhotoIndex < 0) return;
    const nextIndex = (selectedPhotoIndex + 1) % attachmentImages.length;
    setSelectedPhoto(attachmentImages[nextIndex]);
  };

  const showPrevPhoto = () => {
    if (attachmentImages.length === 0 || selectedPhotoIndex < 0) return;
    const prevIndex = (selectedPhotoIndex - 1 + attachmentImages.length) % attachmentImages.length;
    setSelectedPhoto(attachmentImages[prevIndex]);
  };

  const aboutText = [
    `Join ${event.name} organized by ${event.organizer || "our partners"}.`,
    venueAddress !== "Venue TBA" ? `The event takes place at ${venueAddress}.` : "",
    event.price > 0 ? `Tickets start from ₹${event.price}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const eventDescription = event.description?.trim() || aboutText;
  const organizerImageUrl = getEventImageUrl(event.organizer_image);
  const ticketsLeft =
    typeof event.available_tickets === "number"
      ? event.available_tickets
      : typeof event.max_tickets === "number"
        ? Math.max(event.max_tickets - (event.booked_tickets ?? 0), 0)
        : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — content-driven height on mobile; fixed cinematic height on sm+ */}
      <section className="relative w-full overflow-hidden bg-black sm:min-h-[550px] md:min-h-[600px]">
        <div className="absolute inset-0">
          {heroBackground ? (
            <img
              src={heroBackground}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#3E2723] via-[#5D4037] to-[#1a1a1a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-black/60" />
        </div>

        <div className="relative z-10 px-4 pb-10 pt-6 sm:absolute sm:inset-0 sm:flex sm:items-center sm:px-0 sm:py-0">
          <div className="container mx-auto max-w-7xl sm:px-8 lg:px-12">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8 md:gap-10">
              <div className="mx-auto shrink-0 sm:mx-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={event.name}
                    className="h-44 w-28 rounded-xl object-cover shadow-2xl sm:h-80 sm:w-56 md:h-96 md:w-64 lg:h-[430px] lg:w-72"
                  />
                ) : (
                  <div className="flex h-44 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] text-4xl font-bold text-white shadow-2xl sm:h-80 sm:w-56 md:h-96 md:w-64 lg:h-[430px] lg:w-72">
                    {event.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="w-full min-w-0 flex-1 text-center text-white sm:text-left">
                <h1 className="mb-3 text-2xl font-bold leading-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                  {event.name}
                </h1>

                <button
                  type="button"
                  className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/25 sm:hidden"
                  onClick={() => toast.info("Share coming soon")}
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                <div className="mb-3 flex items-center justify-center gap-3 sm:mb-6 sm:justify-start sm:gap-4">
                  <div className="flex items-center gap-2 rounded-lg border border-yellow-600/50 bg-yellow-600/30 px-3 py-2 sm:px-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 sm:h-7 sm:w-7" />
                    <span className="text-lg font-bold sm:text-2xl">{ratingDisplay}/5</span>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap justify-center gap-2 sm:mb-6 sm:justify-start sm:gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-base"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-sm text-white/90 sm:mb-6 sm:gap-6 sm:text-lg sm:justify-start">
                  {duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                      <span>{duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                    <span>{formatShortDate(event.start_date)}</span>
                  </div>
                </div>

                <div className="mb-3 flex items-start justify-center gap-2 text-sm text-white/80 sm:mb-6 sm:justify-start sm:text-lg">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="text-left leading-snug">{venueAddress}</span>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80 sm:mb-8 sm:justify-start sm:gap-3 sm:text-lg">
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    disabled={isLikeUpdating}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-white transition-colors hover:bg-white/25"
                    aria-pressed={isLiked}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-blue-400 text-blue-400" : "text-white"}`} />
                    <span>{isLiked ? "Liked" : "Like"}</span>
                  </button>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-start">
                  <Button
                    className="w-full rounded-xl bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:bg-red-700 hover:shadow-red-600/50 sm:w-auto sm:py-5 sm:px-12"
                    onClick={() => toast.info("Ticket booking coming soon")}
                  >
                    Book Tickets
                  </Button>

                  <Button
                    onClick={() => setIsTrailerOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-black/50 px-6 py-4 text-lg font-bold text-white shadow-2xl backdrop-blur-sm transition-all hover:bg-black/70 sm:w-auto sm:border-white/50 sm:bg-white/10 sm:py-5 sm:px-10 sm:hover:bg-white/20"
                  >
                    <Play className="h-5 w-5 fill-white sm:h-6 sm:w-6" />
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer modal — MovieDetail-style shell */}
      {isTrailerOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-black sm:rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="min-w-0 pr-4">
                <h3 className="text-white font-bold text-sm sm:text-base truncate">
                  {event.name}
                </h3>
                <p className="text-gray-400 text-xs">Event preview</p>
              </div>
              <button
                type="button"
                onClick={() => setIsTrailerOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 sm:p-2.5 transition-all shrink-0"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="relative w-full aspect-video sm:mt-12 bg-black flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={event.name}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              ) : (
                <p className="text-white/70 p-8">Preview image not available.</p>
              )}
            </div>

            <div className="hidden sm:block bg-[#0f0f0f] border-t border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-2">{event.name}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Official event preview from Garba Town. Full trailer integration coming soon.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatShortDate(event.start_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {ratingDisplay}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About only — no cast/crew (event API has no cast/crew data) */}
      <section className="bg-gray-50 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">About the event</h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            {eventDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm sm:text-base text-gray-600">
            <span>
              <strong className="text-gray-900">Starts:</strong> {formatShortDate(event.start_date)}
            </span>
            <span>
              <strong className="text-gray-900">Ends:</strong> {formatShortDate(event.end_date)}
            </span>
            {event.price > 0 && (
              <span>
                <strong className="text-gray-900">From:</strong> ₹{event.price}
              </span>
            )}
            <span>
              <strong className="text-gray-900">Booked:</strong> {event.booked_tickets ?? 0} tickets
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {typeof event.max_tickets === "number" && (
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total tickets</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{event.max_tickets}</p>
              </div>
            )}
            {ticketsLeft !== null && (
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Available tickets</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{ticketsLeft}</p>
              </div>
            )}
            <div className="rounded-lg border bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Booked tickets</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{event.booked_tickets ?? 0}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border bg-white p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizer details</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <div className="h-16 w-16 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                {organizerImageUrl ? (
                  <img
                    src={organizerImageUrl}
                    alt={event.organizer || "Organizer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                    {(event.organizer || "O").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Organizer</p>
                <p className="text-lg font-semibold text-gray-900">{event.organizer || "N/A"}</p>
                {event.mobile && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Mobile:</span> {event.mobile}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-white p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendees</h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">Total users:</span> {event.total_users ?? 0}
              </p>
              <p>
                <span className="font-medium text-gray-900">Attendees count:</span>{" "}
                {event.attendees_count ?? 0}
              </p>
            </div>
          </div>

          {attachmentImages.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Event photos</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {attachmentImages.map((photoUrl, index) => (
                  <button
                    key={`${photoUrl}-${index}`}
                    type="button"
                    className="overflow-hidden rounded-lg border bg-white text-left transition-transform hover:scale-[1.01]"
                    onClick={() => setSelectedPhoto(photoUrl)}
                  >
                    <img
                      src={photoUrl}
                      alt={`${event.name} photo ${index + 1}`}
                      className="h-32 w-full object-cover sm:h-36"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {attachmentImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevPhoto}
                  className="absolute left-2 sm:left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNextPhoto}
                  className="absolute right-12 sm:right-16 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-2 top-2 z-20 rounded-full bg-black/70 p-2 text-white hover:bg-black"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-full max-w-5xl">
              <img
                src={selectedPhoto}
                alt={`${event.name} preview`}
                className="mx-auto max-h-[85vh] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetail;
