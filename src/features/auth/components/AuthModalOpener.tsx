import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AUTH_MODAL_PARAM, stripAuthModalParam } from "@/lib/auth/authRedirect";

export const AUTH_MODAL_EVENT = "bookwatch:open-auth-modal";

export const dispatchAuthModalOpen = (returnTo: string) => {
  window.dispatchEvent(
    new CustomEvent(AUTH_MODAL_EVENT, { detail: { returnTo } }),
  );
};

/** Watches ?auth=1 and opens the Get Started modal without leaving the page. */
const AuthModalOpener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || user) return;

    const params = new URLSearchParams(location.search);
    if (params.get(AUTH_MODAL_PARAM) !== "1") return;

    const cleanPath = stripAuthModalParam(`${location.pathname}${location.search}`);
    dispatchAuthModalOpen(cleanPath);
    navigate(cleanPath, { replace: true });
  }, [authLoading, user, location.pathname, location.search, navigate]);

  return null;
};

export default AuthModalOpener;
