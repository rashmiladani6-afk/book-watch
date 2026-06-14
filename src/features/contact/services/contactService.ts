import axios from "axios";
import { GARBA_API_BEARER } from "@/lib/garba/apiAuth";

const CONTACT_US_URL =
  import.meta.env.VITE_GARBATOWN_CONTACT_US_URL ??
  "/garba-auth/api/v1/odoo/contact_us";

export interface ContactUsRequest {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface ContactUsResponse {
  status: string;
  message?: string;
}

const contactHeaders = {
  Authorization: GARBA_API_BEARER,
  "Content-Type": "application/json",
};

export const contactService = {
  async submitContact(data: ContactUsRequest): Promise<ContactUsResponse> {
    const response = await axios.post<ContactUsResponse>(CONTACT_US_URL, data, {
      headers: contactHeaders,
      timeout: 15000,
    });
    return response.data;
  },
};
