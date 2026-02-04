// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  email: string;
  id?: string;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, token: string, userId?: string | undefined) => void; // Make it explicitly optional
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: () => { },
  signOut: () => { },
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

      if (token && userEmail) {
        const user: User = {
          email: userEmail,
          id: userId || undefined,
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

  const signIn = (email: string, token: string, userId?: string | undefined) => {
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    if (userId) {
      localStorage.setItem('userId', userId);
    }

    // Update state
    const user: User = {
      email,
      id: userId,
    };

    const session: Session = {
      user,
      access_token: token,
    };

    setUser(user);
    setSession(session);
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');

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