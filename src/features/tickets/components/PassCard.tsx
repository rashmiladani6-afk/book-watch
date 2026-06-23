import { Link } from "react-router-dom";
import { Star, Ticket } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { brand } from "@/shared/constants/theme";
import { generateRoute, ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";
import type { CatalogPass } from "@/features/events/utils/eventCatalogMappers";

interface PassCardProps {
  pass: CatalogPass;
}

const PassCard = ({ pass }: PassCardProps) => {
  const isGold = pass.category === "Gold";

  return (
    <article className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {isGold ? (
        <Star className="mb-4 h-5 w-5 text-blue-500" strokeWidth={1.75} fill="currentColor" />
      ) : (
        <Ticket
          className={cn("mb-4 h-5 w-5 -rotate-45 text-blue-500")}
          strokeWidth={1.75}
          fill="currentColor"
        />
      )}

      <h3 className="mb-2 text-base font-semibold leading-snug text-gray-900 line-clamp-2">
        {pass.title}
      </h3>

      <p className="mb-4 text-sm text-gray-500">
        Category: {pass.category}. Date: {pass.date}
      </p>

      <p className="mb-5 text-lg font-bold" style={{ color: brand.primary }}>
        {pass.price ? `Rs. ${pass.price}` : "See details"}
      </p>

      <Link
        to={pass.eventId ? generateRoute.eventDetail(pass.eventId) : ROUTES.EVENTS_LIST}
        className="mt-auto"
      >
        <Button
          className="w-full text-white hover:opacity-90"
          style={{ backgroundColor: brand.primary }}
        >
          Book now
        </Button>
      </Link>
    </article>
  );
};

export default PassCard;
