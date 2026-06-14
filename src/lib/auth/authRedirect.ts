import { ROUTES } from "@/shared/constants/routes";

export const AUTH_MODAL_PARAM = "auth";

export const getSafeReturnPath = (returnTo?: string | null) => {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return ROUTES.HOME;
  }
  return returnTo;
};

export const stripAuthModalParam = (path: string) => {
  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.delete(AUTH_MODAL_PARAM);
  const next = params.toString();
  return next ? `${pathname}?${next}` : pathname;
};

export const buildPathWithAuthModal = (returnTo?: string | null) => {
  const base = stripAuthModalParam(
    returnTo && returnTo.startsWith("/")
      ? returnTo
      : typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : ROUTES.HOME,
  );

  const [pathname, search = ""] = base.split("?");
  const params = new URLSearchParams(search);
  params.set(AUTH_MODAL_PARAM, "1");
  return `${pathname}?${params.toString()}`;
};

/** Opens the in-app Get Started modal on the current (or target) page. */
export const getAuthUrl = (returnTo?: string) => buildPathWithAuthModal(returnTo);
