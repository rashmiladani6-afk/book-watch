const SESSION_KEY = "garba_auth_session";

export interface PersistedSession {
  access_token: string;
  identifier: string;
  userId?: string;
  name?: string;
}

const readLegacySession = (): PersistedSession | null => {
  const access_token = localStorage.getItem("authToken")?.trim();
  if (!access_token) return null;

  return {
    access_token,
    identifier: localStorage.getItem("userEmail")?.trim() || "user",
    userId: localStorage.getItem("userId") || undefined,
    name: localStorage.getItem("userName") || undefined,
  };
};

export const loadPersistedSession = (): PersistedSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedSession>;
      const access_token = parsed.access_token?.trim();
      if (access_token) {
        return {
          access_token,
          identifier: parsed.identifier?.trim() || "user",
          userId: parsed.userId,
          name: parsed.name,
        };
      }
    }
  } catch {
    // Fall through to legacy keys.
  }

  return readLegacySession();
};

export const savePersistedSession = (session: PersistedSession) => {
  const normalized: PersistedSession = {
    access_token: session.access_token.trim(),
    identifier: session.identifier.trim() || "user",
    userId: session.userId,
    name: session.name,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  localStorage.setItem("authToken", normalized.access_token);
  localStorage.setItem("userEmail", normalized.identifier);
  if (normalized.userId) {
    localStorage.setItem("userId", normalized.userId);
  } else {
    localStorage.removeItem("userId");
  }
  if (normalized.name) {
    localStorage.setItem("userName", normalized.name);
  } else {
    localStorage.removeItem("userName");
  }
};

export const clearPersistedSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
};
