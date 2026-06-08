import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { clearAuthQueries, refreshAuthQueries } from "@/lib/auth/refreshAuthQueries";

/**
 * Refetches API data when the user signs in or restores a saved session.
 * Clears cached user data on sign out so stale cart/events are not shown.
 */
const AuthDataSync = () => {
  const { session, loading } = useAuth();
  const queryClient = useQueryClient();
  const prevTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const token = session?.access_token ?? null;

    if (token && token !== prevTokenRef.current) {
      prevTokenRef.current = token;
      void refreshAuthQueries(queryClient);
      return;
    }

    if (!token && prevTokenRef.current) {
      prevTokenRef.current = null;
      clearAuthQueries(queryClient);
    }
  }, [loading, session?.access_token, queryClient]);

  return null;
};

export default AuthDataSync;
