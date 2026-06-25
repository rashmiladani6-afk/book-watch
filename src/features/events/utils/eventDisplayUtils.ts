import { getEventEntryCount } from "@/features/events/components/EventTrendCard";
import type { PopularEvent } from "@/features/events/services/eventService";

export const sortByRatingThenEntries = (events: PopularEvent[]) =>
  [...events].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return getEventEntryCount(b) - getEventEntryCount(a);
  });
