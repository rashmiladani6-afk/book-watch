
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/authService";
import {
  clearPersistedSession,
  loadPersistedSession,
  savePersistedSession,
  type PersistedSession,
} from "@/lib/auth/persistedSession";
import { validateSessionToken } from "@/lib/auth/validateSession";

interface User {
  email: string;
  id?: string;
  name?: string;
}

interface Session {
  user: User;
  access_token: string;
}

export interface AuthSignInPayload {
  /** The identifier the user authenticated with (email or mobile). */
  identifier: string;
  token: string;
  userId?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (payload: AuthSignInPayload) => void;
  signOut: () => Promise<void>;
}

const buildAuthState = (stored: PersistedSession | null) => {
  if (!stored) {
    return { user: null, session: null };
  }

  const user: User = {
    email: stored.identifier,
    id: stored.userId,
    name: stored.name,
  };

  return {
    user,
    session: { user, access_token: stored.access_token },
  };
};

const initialStored = loadPersistedSession();
const initialAuth = buildAuthState(initialStored);

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [session, setSession] = useState<Session | null>(initialAuth.session);
  const [loading, setLoading] = useState(!!initialStored);
  const validatedRef = useRef(false);

  const applyStoredSession = useCallback((stored: PersistedSession | null) => {
    const next = buildAuthState(stored);
    setUser(next.user);
    setSession(next.session);
  }, []);

  const clearLocalSession = useCallback(() => {
    clearPersistedSession();
    setUser(null);
    setSession(null);
  }, []);

  const signIn = useCallback(({ identifier, token, userId, name }: AuthSignInPayload) => {
    const stored: PersistedSession = {
      access_token: token,
      identifier: identifier.trim() || "user",
      userId,
      name,
    };

    savePersistedSession(stored);
    applyStoredSession(stored);
    setLoading(false);
  }, [applyStoredSession]);

  const signOut = useCallback(async () => {
    const token = session?.access_token ?? loadPersistedSession()?.access_token ?? null;
    const userId = user?.id ?? loadPersistedSession()?.userId;

    try {
      if (token) {
        await authService.logout(token, userId);
      }
    } catch {
      // Always clear local session even if the server logout fails.
    }

    clearLocalSession();
    setLoading(false);
  }, [clearLocalSession, session?.access_token, user?.id]);

  useEffect(() => {
    if (validatedRef.current) return;
    validatedRef.current = true;

    let cancelled = false;
    const stored = loadPersistedSession();
    if (!stored) {
      setLoading(false);
      return;
    }

    void (async () => {
      const result = await validateSessionToken(stored.access_token);
      if (cancelled) return;

      if (result === "invalid") {
        clearLocalSession();
        toast.info("Your session expired. Please sign in again.");
      } else {
        applyStoredSession(stored);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [applyStoredSession, clearLocalSession]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "garba_auth_session" && event.key !== "authToken") {
        return;
      }

      const stored = loadPersistedSession();
      if (!stored) {
        setUser(null);
        setSession(null);
        return;
      }

      applyStoredSession(stored);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyStoredSession]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
