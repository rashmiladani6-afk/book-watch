import type { PopularEvent } from "@/features/events/services/eventService";
import { resolveGarbaAssetUrl } from "@/lib/garba/assetUrl";

export const getEventImageUrl = (event: PopularEvent): string | null =>
  resolveGarbaAssetUrl(event.image);

export const getEventEntryCount = (event: PopularEvent) =>
  event.attendees_count ?? event.attendee_count ?? event.booked_tickets ?? 0;

export const formatCatalogDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const extractCity = (address?: string) => {
  if (!address?.trim()) return "Ahmedabad";
  const knownCities = ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Gandhinagar"];
  const lower = address.toLowerCase();
  const match = knownCities.find((city) => lower.includes(city.toLowerCase()));
  if (match) return match;
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || "Ahmedabad";
};

export interface CatalogVenue {
  id: string;
  city: string;
  name: string;
  guestCount: number;
  image: string;
  eventLabel: string;
  eventId: number;
}

export type PassCategory = "Gold" | "General";

export interface CatalogPass {
  id: string;
  title: string;
  category: PassCategory;
  date: string;
  price: number;
  iconType: "ticket" | "star";
  eventId: number;
}

const getPassCategory = (event: PopularEvent): PassCategory => {
  const status = event.status?.trim().toLowerCase();
  if (status === "gold") return "Gold";
  if (status === "general") return "General";
  return event.price >= 200 ? "Gold" : "General";
};

export interface CatalogSinger {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  eventId: number;
}

const eventsWithImages = (events: PopularEvent[]) =>
  events.filter((event) => Boolean(getEventImageUrl(event)));

export const mapEventsToVenues = (events: PopularEvent[]): CatalogVenue[] => {
  const seen = new Set<string>();

  return eventsWithImages(events).reduce<CatalogVenue[]>((venues, event) => {
    const venueKey = (event.address || event.name).trim().toLowerCase();
    if (!venueKey || seen.has(venueKey)) return venues;

    seen.add(venueKey);
    const image = getEventImageUrl(event);
    if (!image) return venues;

    venues.push({
      id: `venue-${event.id}`,
      city: extractCity(event.address),
      name: event.address?.trim() || event.name,
      guestCount: getEventEntryCount(event),
      image,
      eventLabel: event.name,
      eventId: event.id,
    });

    return venues;
  }, []);
};

export const mapEventsToPasses = (events: PopularEvent[]): CatalogPass[] => {
  const mapped = events.map((event) => {
    const category = getPassCategory(event);

    return {
      id: `pass-${event.id}`,
      title: `${event.name} - Registration for ${event.name}`,
      category,
      date: formatCatalogDate(event.start_date),
      price: event.price,
      iconType: category === "Gold" ? "star" : "ticket",
      eventId: event.id,
    } satisfies CatalogPass;
  });

  const sheriEvent = events.find((event) => /sheri garba/i.test(event.name));
  const featuredGeneralPass: CatalogPass = {
    id: "pass-featured-sheri-garba",
    title: "Sheri Garba - Registration for Sheri Garba",
    category: "General",
    date: sheriEvent ? formatCatalogDate(sheriEvent.start_date) : "07 Jun 2026",
    price: 100,
    iconType: "ticket",
    eventId: sheriEvent?.id ?? events[0]?.id ?? 0,
  };

  return [featuredGeneralPass, ...mapped];
};

export const mapEventsToSingers = (events: PopularEvent[]): CatalogSinger[] => {
  const seen = new Set<string>();

  return eventsWithImages(events).reduce<CatalogSinger[]>((singers, event) => {
    const singerName = event.organizer?.trim() || `${event.name} Mandal`;
    const key = singerName.toLowerCase();
    if (seen.has(key)) return singers;

    seen.add(key);
    const image = getEventImageUrl(event);
    if (!image) return singers;

    singers.push({
      id: `singer-${event.id}`,
      category: event.organizer ? "Traditional live garba" : "Live garba performance",
      name: singerName,
      description: "Live performance schedule available with event passes.",
      image,
      eventId: event.id,
    });

    return singers;
  }, []);
};

export const pickVipHeroImage = (events: PopularEvent[]): string | null => {
  const withImages = eventsWithImages(events);
  const preferred =
    withImages.find((event) => /mandli|rataldi/i.test(event.name)) ?? withImages[0];

  return preferred ? getEventImageUrl(preferred) : null;
};
