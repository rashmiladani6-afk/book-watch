import { extractAuthUser, authService } from "@/features/auth/services/authService";
import { extractGarbaApiMessage } from "@/lib/garba/apiAuth";
import { normalizeUserToken } from "@/lib/garba/apiAuth";

const GUEST_BROWSE_USER_TOKEN =
  import.meta.env.VITE_GARBATOWN_GUEST_USER_TOKEN?.trim() ?? "";

const BROWSE_EMAIL = import.meta.env.VITE_GARBATOWN_BROWSE_EMAIL?.trim() ?? "";
const BROWSE_PASSWORD = import.meta.env.VITE_GARBATOWN_BROWSE_PASSWORD?.trim() ?? "";

let cachedBrowseToken: string | null = GUEST_BROWSE_USER_TOKEN || null;
let browseLoginPromise: Promise<string> | null = null;

export class GuestBrowseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuestBrowseError";
  }
}

const loginBrowseAccount = async (): Promise<string> => {
  if (GUEST_BROWSE_USER_TOKEN) {
    return GUEST_BROWSE_USER_TOKEN;
  }

  if (!BROWSE_EMAIL || !BROWSE_PASSWORD) {
    throw new GuestBrowseError(
      "Guest browse is not configured. Add VITE_GARBATOWN_GUEST_USER_TOKEN or browse email/password to .env, then restart the dev server.",
    );
  }

  try {
    const response = await authService.login({
      login: BROWSE_EMAIL,
      type: "password",
      password: BROWSE_PASSWORD,
    });

    if (response.status && response.status !== "success") {
      throw new GuestBrowseError(response.message || "Guest browse login failed.");
    }

    const authUser = extractAuthUser(response);
    const token =
      authUser?.user_token ?? authUser?.token ?? authUser?.access_token ?? null;

    if (!token) {
      throw new GuestBrowseError("Guest browse login succeeded but no user token was returned.");
    }

    cachedBrowseToken = token.replace(/^Bearer\s+/i, "");
    return cachedBrowseToken;
  } catch (error) {
    if (error instanceof GuestBrowseError) {
      throw error;
    }

    const message =
      extractGarbaApiMessage(error) ??
      (error as Error)?.message ??
      "Guest browse login failed.";

    console.error("Browse account login failed:", message);
    throw new GuestBrowseError(message);
  }
};

/**
 * Resolves a token for read-only event browsing.
 * Uses the signed-in user token when available; otherwise falls back to a
 * configured guest/browse token without updating AuthContext.
 */
export const ensureBrowseUserToken = async (
  userToken?: string | null,
  options?: { skipStoredToken?: boolean },
): Promise<string> => {
  const signedInToken = options?.skipStoredToken
    ? (userToken ?? "").trim().replace(/^Bearer\s+/i, "")
    : normalizeUserToken(userToken);

  if (signedInToken) {
    return signedInToken;
  }

  if (cachedBrowseToken) {
    return cachedBrowseToken;
  }

  if (!browseLoginPromise) {
    browseLoginPromise = loginBrowseAccount().finally(() => {
      browseLoginPromise = null;
    });
  }

  return browseLoginPromise;
};

export const clearCachedBrowseToken = () => {
  if (!GUEST_BROWSE_USER_TOKEN) {
    cachedBrowseToken = null;
  }
};
