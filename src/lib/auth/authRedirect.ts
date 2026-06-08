import { ROUTES } from "@/shared/constants/routes";

export const getSafeReturnPath = (returnTo?: string | null) => {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return ROUTES.HOME;
  }
  return returnTo;
};

export const getAuthUrl = (returnTo?: string) => {
  const path =
    returnTo ??
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : ROUTES.HOME);
  return `${ROUTES.AUTH}?returnTo=${encodeURIComponent(path)}`;
};
