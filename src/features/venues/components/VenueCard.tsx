import { Link } from "react-router-dom";
import { brand } from "@/shared/constants/theme";
import { generateRoute } from "@/shared/constants/routes";
import type { CatalogVenue } from "@/features/events/utils/eventCatalogMappers";

interface VenueCardProps {
  venue: CatalogVenue;
}

const VenueCard = ({ venue }: VenueCardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative bg-gray-100">
        <img
          src={venue.image}
          alt={venue.eventLabel}
          className="w-full h-auto max-h-[480px] object-contain object-center"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium mb-1" style={{ color: brand.primary }}>
          {venue.city}
        </p>

        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
          {venue.name}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          {venue.guestCount > 0 ? `${venue.guestCount} guests` : "View event details"}
        </p>

        <Link
          to={generateRoute.eventDetail(venue.eventId)}
          className="mt-auto text-sm font-semibold hover:underline"
          style={{ color: brand.primary }}
        >
          View events
        </Link>
      </div>
    </article>
  );
};

export default VenueCard;
