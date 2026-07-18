"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authService from "@/services";
import type { LoginInput, RegisterInput, User } from "@/types";

/**
 * Temporary mock auth state. Wraps the auth service so swapping in
 * Laravel Sanctum later only changes the service layer, not this
 * provider or any consumer.
 */

interface AuthContextValue {
  user: User | null;
  /** False until the persisted session has been read on the client. */
  hydrated: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    authService.getCurrentUser().then((currentUser) => {
      if (active) {
        setUser(currentUser);
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const loggedIn = await authService.login(input);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const registered = await authService.register(input);
    setUser(registered);
    return registered;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
