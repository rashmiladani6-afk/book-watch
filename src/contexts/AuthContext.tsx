// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');
      const userId = localStorage.getItem('userId');

      const userName = localStorage.getItem('userName');
      if (token && userEmail) {
        const user: User = {
          email: userEmail,
          id: userId || undefined,
          name: userName || undefined,
        };

        const session: Session = {
          user,
          access_token: token,
        };

        setUser(user);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = ({ identifier, token, userId, name }: AuthSignInPayload) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', identifier);
    if (userId) localStorage.setItem('userId', userId);
    if (name) localStorage.setItem('userName', name);

    const user: User = { email: identifier, id: userId, name };
    const session: Session = { user, access_token: token };

    setUser(user);
    setSession(session);
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    // Clear state
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};