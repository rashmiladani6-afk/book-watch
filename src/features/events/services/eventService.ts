import axios from "axios";
import type { EventsResponse } from "@/features/events/types/events";

const API_BASE_URL = "/api/v1/odoo";
const AUTH_TOKEN = "Bearer 3zwg4rojjDnuNPqpOehv4rAwYnLfNZb2JBAN"; // TODO: move to env (VITE_EVENTS_TOKEN)

export interface GetEventsParams {
  limit?: number;
  offset?: number;
}

export const eventService = {
  async getEvents(params?: GetEventsParams): Promise<EventsResponse> {
    const url = `${API_BASE_URL}/events`;

    const response = await axios.get<EventsResponse>(url, {
      headers: {
        Authorization: AUTH_TOKEN,
      },
      params,
    });

    return response.data;
  },

  async getEventById(id: number | string): Promise<EventsResponse["data"][number] | undefined> {
    const list = await eventService.getEvents();
    return list.data.find((event) => event.id === Number(id));
  },
 
  async getEventTypes(params?: GetEventsParams): Promise<EventTypesResponse> {
    const url = `${API_BASE_URL}/events-type`;
    const response = await axios.get<EventTypesResponse>(url, {
      headers: {
        Authorization: AUTH_TOKEN,
      },
      params,
    });
    return response.data;
  },
};


