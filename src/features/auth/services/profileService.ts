import axios from "axios";
import { buildGarbaAuthHeaderVariants } from "@/lib/garba/apiAuth";

const GARBA_PROXY_BASE = "/garba-auth";

const PROFILE_URL =
  import.meta.env.VITE_GARBATOWN_PROFILE_URL ??
  `${GARBA_PROXY_BASE}/api/v1/user/profile`;
const EDIT_PROFILE_URL =
  import.meta.env.VITE_GARBATOWN_EDIT_PROFILE_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/edit_profile`;
const DELETE_ACCOUNT_URL =
  import.meta.env.VITE_GARBATOWN_DELETE_ACCOUNT_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/delete_account`;
const CHANGE_PASSWORD_URL =
  import.meta.env.VITE_GARBATOWN_CHANGE_PASSWORD_URL ??
  `${GARBA_PROXY_BASE}/api/v1/odoo/change_password`;

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  image: string | null;
}

export interface ProfileResponse {
  status: string;
  message?: string;
  data?: UserProfile;
}

export interface EditProfileRequest {
  name: string;
  mobile: string;
  image?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export const normalizeProfileMobile = (mobile: string) =>
  mobile.replace(/\D/g, "").slice(-10);

const parseProfileResponse = (
  data: unknown,
  httpStatus: number,
): ProfileResponse => {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const body = data as ProfileResponse;
    if (body.status || body.message) {
      return body;
    }
  }

  return {
    status: "error",
    message:
      httpStatus === 409
        ? "This mobile number is already used by another account."
        : `Could not update profile (HTTP ${httpStatus}).`,
  };
};

const requestWithHeaders = async <T>(
  userToken: string | null | undefined,
  requestFn: (headers: Record<string, string>) => Promise<T>,
): Promise<T> => {
  const headerVariants = buildGarbaAuthHeaderVariants(userToken);
  if (headerVariants.length === 0) {
    throw new Error("User token is required for profile API");
  }

  let lastError: unknown = null;
  for (const headers of headerVariants) {
    try {
      return await requestFn(headers);
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        continue;
      }
      throw error;
    }
  }

  throw lastError;
};

export const profileService = {
  async getProfile(userToken?: string | null): Promise<ProfileResponse> {
    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.get<ProfileResponse>(PROFILE_URL, {
        headers,
        timeout: 15000,
      });
      return response.data;
    });
  },

  async editProfile(
    data: EditProfileRequest,
    userToken?: string | null,
  ): Promise<ProfileResponse> {
    const payload = {
      name: data.name.trim(),
      mobile: normalizeProfileMobile(data.mobile),
      image: data.image ?? "",
    };

    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.post<ProfileResponse>(
        EDIT_PROFILE_URL,
        payload,
        {
          headers,
          timeout: payload.image ? 60000 : 15000,
          validateStatus: () => true,
        },
      );
      return parseProfileResponse(response.data, response.status);
    });
  },

  async deleteAccount(userToken?: string | null): Promise<ProfileResponse> {
    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.post<ProfileResponse>(DELETE_ACCOUNT_URL, {}, {
        headers,
        timeout: 15000,
      });
      return response.data;
    });
  },

  async changePassword(
    data: ChangePasswordRequest,
    userToken?: string | null,
  ): Promise<ProfileResponse> {
    return requestWithHeaders(userToken, async (headers) => {
      const response = await axios.post<ProfileResponse>(
        CHANGE_PASSWORD_URL,
        {
          old_password: data.old_password,
          new_password: data.new_password,
        },
        {
          headers,
          timeout: 15000,
          validateStatus: () => true,
        },
      );
      return parseProfileResponse(response.data, response.status);
    });
  },
};
