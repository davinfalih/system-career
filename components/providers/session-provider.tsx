"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

type AuthContextValue = {
  user: ClientUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  status: "loading",
  signOut: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser({ id: data.id, name: data.name, email: data.email, role: data.role, image: data.image });
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setStatus("unauthenticated");
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, status, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
