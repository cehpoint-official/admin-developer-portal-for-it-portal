import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";

export type UserRole = "client" | "admin" | "developer";

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  phone?: string | null;
  role: UserRole;
  avatar: string | null;
  createdAt: number;
  lastLogin: number;
}

export interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  resetAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      error: null,
    }),
}));