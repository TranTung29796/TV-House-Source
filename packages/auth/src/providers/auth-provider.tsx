"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AuthUser } from "../client/server";
import { useUser } from "../hooks/use-user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  refresh: async () => {},
});

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser?: AuthUser | null }) {
  const auth = useUser(initialUser);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
