import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { buildPathWithAuthModal, getSafeReturnPath } from "@/lib/auth/authRedirect";

/**
 * Legacy /auth route — redirects back to the app and opens the Get Started modal.
 */
const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const returnTo = getSafeReturnPath(searchParams.get("returnTo"));

  if (user) {
    return <Navigate to={returnTo} replace />;
  }

  return <Navigate to={buildPathWithAuthModal(returnTo)} replace />;
};

export default Auth;
