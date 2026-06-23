import { Link } from "react-router-dom";
import { brand } from "@/shared/constants/theme";
import { generateRoute } from "@/shared/constants/routes";
import type { CatalogSinger } from "@/features/events/utils/eventCatalogMappers";

interface SingerCardProps {
  singer: CatalogSinger;
}

const SingerCard = ({ singer }: SingerCardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 sm:h-56 bg-gray-100">
        <img
          src={singer.image}
          alt={singer.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium mb-2" style={{ color: brand.primary }}>
          {singer.category}
        </p>

        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">
          {singer.name}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {singer.description}
        </p>

        <Link
          to={generateRoute.eventDetail(singer.eventId)}
          className="mt-auto text-sm font-semibold hover:underline"
          style={{ color: brand.primary }}
        >
          See schedule
        </Link>
      </div>
    </article>
  );
};

export default SingerCard;
