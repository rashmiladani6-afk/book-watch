import { Link } from "react-router-dom";
import { Star, Ticket } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { brand } from "@/shared/constants/theme";
import { generateRoute } from "@/shared/constants/routes";
import type { CatalogPass } from "@/features/events/utils/eventCatalogMappers";

interface PassCardProps {
  pass: CatalogPass;
}

const PassCard = ({ pass }: PassCardProps) => {
  const Icon = pass.iconType === "star" ? Star : Ticket;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-36 bg-gray-100">
        <img src={pass.image} alt={pass.title} className="h-full w-full object-cover" />
        <div className="absolute top-3 left-3 rounded-lg bg-white/90 p-1.5">
          <Icon className="h-5 w-5" style={{ color: brand.primary }} strokeWidth={1.75} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2 mb-2">
          {pass.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Category: {pass.category}. Date: {pass.date}
        </p>

        <p className="text-lg font-bold mb-5" style={{ color: brand.primary }}>
          {pass.price ? `Rs. ${pass.price}` : "See details"}
        </p>

        <Link to={generateRoute.eventDetail(pass.eventId)} className="mt-auto">
          <Button
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: brand.primary }}
          >
            Book now
          </Button>
        </Link>
      </div>
    </article>
  );
};

export default PassCard;
