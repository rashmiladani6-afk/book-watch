import type { EventsMeta } from "@/shared/types/api";

export interface EventCategory {
  id: number;
  name: string;
}

export interface EventVenue {
  id?: number;
  street?: string | false;
  street2?: string | false;
  city?: string | false;
  zip?: string | false;
  state?: string | false;
}

export interface EventCountry {
  id?: number;
  name?: string;
}

export interface EventOrganizer {
  id: number;
  name: string;
}

export interface EventTag {
  id: number;
  name: string;
}

export interface EventTicketType {
  id: number;
  name: string;
  maximum_seats: number;
  maximum_buy: number;
  description: string | false;
  price: number;
}

export interface EventApiItem {
  id: number;
  start_date: string;
  end_date: string;
  name: string;
  category_id: EventCategory;
  venue: EventVenue;
  country_id: EventCountry;
  organizer: EventOrganizer;
  notes: string | false;
  tags_ids: EventTag[];
  tickets_type: EventTicketType[];
}

export interface EventsResponse {
  status: string;
  message: string;
  meta: EventsMeta;
  data: EventApiItem[];
}

export interface EventTypeItem {
  id: number;
  name: string;
  notes: string | false;
  event_instructions: string | false;
  tags_ids: any[];
}

export interface EventTypesResponse {
  status: string;
  message: string;
  meta: EventsMeta;
  data: EventTypeItem[];
}


