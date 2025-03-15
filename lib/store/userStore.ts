import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User as FirebaseUser } from "firebase/auth";

// Define user roles
export type UserRole = "client" | "admin" | "developer";

// Define user profile structure
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

// Define auth state structure
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

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true, // Start with loading true until we check auth state
      isAuthenticated: false,
      error: null,

      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })),

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
    }),
    {
      name: "auth-storage",
    }
  )
);
