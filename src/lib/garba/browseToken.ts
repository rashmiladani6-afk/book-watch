import { extractAuthUser, authService } from "@/features/auth/services/authService";
import { normalizeUserToken } from "@/lib/garba/apiAuth";

const GUEST_BROWSE_USER_TOKEN =
  import.meta.env.VITE_GARBATOWN_GUEST_USER_TOKEN?.trim() ?? "";

const BROWSE_EMAIL = import.meta.env.VITE_GARBATOWN_BROWSE_EMAIL?.trim() ?? "";
const BROWSE_PASSWORD = import.meta.env.VITE_GARBATOWN_BROWSE_PASSWORD?.trim() ?? "";

let cachedBrowseToken: string | null = GUEST_BROWSE_USER_TOKEN || null;
let browseLoginPromise: Promise<string | null> | null = null;

const loginBrowseAccount = async (): Promise<string | null> => {
  if (!BROWSE_EMAIL || !BROWSE_PASSWORD) {
    return null;
  }

  try {
    const response = await authService.login({
      login: BROWSE_EMAIL,
      type: "password",
      password: BROWSE_PASSWORD,
    });

    const authUser = extractAuthUser(response.data);
    const token =
      authUser?.user_token ?? authUser?.token ?? authUser?.access_token ?? null;

    if (token) {
      cachedBrowseToken = token.replace(/^Bearer\s+/i, "");
      return cachedBrowseToken;
    }
  } catch {
    return null;
  }

  return null;
};

/**
 * Resolves a token for read-only event browsing.
 * Uses the signed-in user token when available; otherwise falls back to a
 * configured guest/browse token without updating AuthContext.
 */
export const ensureBrowseUserToken = async (
  userToken?: string | null,
): Promise<string | null> => {
  const signedInToken = normalizeUserToken(userToken);
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
