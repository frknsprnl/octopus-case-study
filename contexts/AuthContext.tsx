"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode
} from "react";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (userData: AuthUser, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Refresh 5 minutes before the 30-minute token expiry
const REFRESH_INTERVAL_MS = 25 * 60 * 1000;
const STORAGE_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Tracks which storage was used so refresh / logout target the right one
  const storageType = useRef<"local" | "session">("local");

  function getStorage(): Storage {
    return storageType.current === "local" ? localStorage : sessionStorage;
  }

  // Hydrate from storage on mount (localStorage takes precedence)
  useEffect(() => {
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) {
      try {
        setUser(JSON.parse(fromLocal));
        storageType.current = "local";
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const fromSession = sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) {
      try {
        setUser(JSON.parse(fromSession));
        storageType.current = "session";
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function login(userData: AuthUser, remember: boolean) {
    storageType.current = remember ? "local" : "session";
    getStorage().setItem(STORAGE_KEY, JSON.stringify(userData));
    // Presence cookie for middleware route protection (no sensitive data)
    const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 days or session
    document.cookie = `${STORAGE_KEY}=1; path=/; SameSite=Lax${maxAge ? `; max-age=${maxAge}` : ""}`;
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    // Clear presence cookie
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
    setUser(null);
  }

  const refreshSession = useCallback(async () => {
    const raw = getStorage().getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const stored: AuthUser = JSON.parse(raw);
      const res = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: stored.refreshToken,
          expiresInMins: 30
        })
      });

      if (!res.ok) {
        // Refresh failed → force logout
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
        return;
      }

      const { accessToken, refreshToken } = await res.json();
      const updated: AuthUser = { ...stored, accessToken, refreshToken };
      getStorage().setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    } catch {
      // Network error — keep the existing session alive
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh before token expiry
  useEffect(() => {
    if (!user) return;
    const id = setInterval(refreshSession, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, refreshSession]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
