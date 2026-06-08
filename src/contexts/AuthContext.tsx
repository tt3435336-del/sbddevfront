import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiRequest,
  AuthUser,
  clearAuthSession,
  getStoredAuthSession,
  saveAuthSession,
} from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const session = getStoredAuthSession();

      if (!session) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await apiRequest<AuthUser>("/api/auth/me", { auth: true });
        if (!mounted) return;

        const nextSession = {
          ...session,
          user: response.data,
        };

        saveAuthSession(nextSession);
        setUser(response.data);
      } catch {
        clearAuthSession();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveAuthSession(response.data);
      setUser(response.data.user);
      return { error: null };
    } catch (error) {
      clearAuthSession();
      setUser(null);
      return { error: error instanceof Error ? error : new Error("Erreur de connexion") };
    }
  };

  const signOut = async () => {
    clearAuthSession();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
