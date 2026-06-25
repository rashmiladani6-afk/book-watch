import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { PopularEvent } from "@/features/events/services/eventService";
import { generateRoute } from "@/shared/constants/routes";
import { resolveGarbaAssetUrl } from "@/lib/garba/assetUrl";
import EventLikeButton from "@/features/events/components/EventLikeButton";
import { brand } from "@/shared/constants/theme";

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80";

export const getEventImageUrl = (image: string | null | undefined) =>
  resolveGarbaAssetUrl(image, DEFAULT_EVENT_IMAGE) ?? DEFAULT_EVENT_IMAGE;

export const formatShortEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const getEventEntryCount = (event: PopularEvent) =>
  event.attendees_count ?? event.attendee_count ?? event.booked_tickets ?? 0;

export const isNewEvent = (event: PopularEvent, index?: number) => {
  if (index !== undefined && index < 3) return true;
  if (!event.start_date) return false;
  const startDate = new Date(event.start_date.replace(" ", "T"));
  if (Number.isNaN(startDate.getTime())) return false;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return startDate >= weekAgo;
};

interface EventTrendCardProps {
  event: PopularEvent;
  index?: number;
  userToken?: string;
  variant?: "carousel" | "grid";
}

const EventTrendCard = ({
  event,
  index = 0,
  userToken,
  variant = "carousel",
}: EventTrendCardProps) => {
  const imageUrl = getEventImageUrl(event.image);
  const entryCount = getEventEntryCount(event);
  const showNew = isNewEvent(event, index);
  const shortDate = formatShortEventDate(event.start_date);

  if (variant === "grid") {
    return (
      <div className="overflow-hidden flex flex-col h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="relative bg-gray-100">
          <Link to={generateRoute.eventDetail(event.id)} className="block">
            <img
              src={imageUrl}
              alt={event.name}
              className="w-full h-auto max-h-[480px] object-contain object-center"
            />
          </Link>
          <div className="absolute top-2 right-2">
            <EventLikeButton
              eventId={event.id}
              isLiked={Boolean(event.is_like)}
              userToken={userToken}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {event.rating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs font-medium rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {event.rating.toFixed(1)}
              </span>
            )}
            {showNew && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                New
              </span>
            )}
          </div>
          <Link to={generateRoute.eventDetail(event.id)}>
            <h3 className="font-semibold text-base line-clamp-2 hover:text-[#955F3B] transition-colors">
              {event.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-1">
            {event.address || event.organizer}
          </p>
          <p className="text-xs text-gray-400">
            {entryCount > 0 && `${entryCount} Booked · `}
            {shortDate}
          </p>
          <p className="text-sm font-bold" style={{ color: brand.primary }}>
            {event.price ? `Rs. ${event.price} onwards` : "See details"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 snap-start relative">
      <div className="absolute top-2 right-2 z-10">
        <EventLikeButton
          eventId={event.id}
          isLiked={Boolean(event.is_like)}
          userToken={userToken}
        />
      </div>

      <Link to={generateRoute.eventDetail(event.id)}>
        <div className="relative bg-gray-100">
          <img
            src={imageUrl}
            alt={event.name}
            className="w-full h-auto max-h-[480px] object-contain object-center"
          />
        </div>

        <div className="p-3 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {event.rating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs font-medium rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {event.rating.toFixed(1)}
              </span>
            )}
            {showNew && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                New
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm line-clamp-2" style={{ color: brand.text }}>
            {event.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {event.address || event.organizer}
          </p>
          <p className="text-xs text-gray-400">
            {entryCount > 0 && `${entryCount} Booked · `}
            {shortDate}
          </p>
          <p className="text-sm font-bold" style={{ color: brand.primary }}>
            {event.price ? `Rs. ${event.price} onwards` : "See details"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default EventTrendCard;
