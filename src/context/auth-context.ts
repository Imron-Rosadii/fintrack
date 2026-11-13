import { createContext } from "react";

import type { AuthError, Session, User } from "@supabase/supabase-js";

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: AuthError | null;
    session: Session | null;
    user: User | null;
  }>;

  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;

  signOut: () => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
