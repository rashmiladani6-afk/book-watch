export const GARBA_API_BEARER =
  import.meta.env.VITE_GARBATOWN_API_BEARER ?? "Bearer 2ubGisLUnejgLUandBFhPIEel1W5R55BFsUc";

export const buildGarbaServiceBearerHeaders = (): Record<string, string> => ({
  Authorization: GARBA_API_BEARER,
  "Content-Type": "application/json",
});

export const normalizeUserToken = (userToken?: string | null) => {
  const tokenFromStorage = localStorage.getItem("authToken");
  const token = (userToken ?? tokenFromStorage ?? "").trim();
  return token.replace(/^Bearer\s+/i, "");
};

export const buildGarbaAuthHeaderVariants = (userToken?: string | null): Record<string, string>[] => {
  const normalizedToken = normalizeUserToken(userToken);
  if (!normalizedToken) return [];

  const baseHeaders = {
    Authorization: GARBA_API_BEARER,
    "Content-Type": "application/json",
  };

  return [
    { ...baseHeaders, AuthorizationUserToken: normalizedToken },
    { ...baseHeaders, AuthorizationuserToken: normalizedToken },
    { ...baseHeaders, AuthorizationUserToken: `Bearer ${normalizedToken}` },
    { ...baseHeaders, Authorizationtoken: normalizedToken },
    { ...baseHeaders, "Authorization-Token": normalizedToken },
  ];
};

export const extractGarbaApiMessage = (error: unknown): string | null => {
  const response = (error as { response?: { status?: number; data?: unknown } })?.response;
  const data = response?.data;

  if (typeof data === "string") {
    if (data.includes("Page Not Found")) {
      return "Buy ticket API is not available on the Garba Town server (404).";
    }
    if (data.trim().startsWith("<")) return null;
    return data;
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const message = (data as { message?: string }).message;
    if (message) return message;
  }

  if (response?.status === 404) {
    return "Buy ticket API is not available on the Garba Town server (404).";
  }

  if (response?.status === 409) {
    return (
      (data as { message?: string } | undefined)?.message ||
      "This mobile number is already used by another account."
    );
  }

  return null;
};
