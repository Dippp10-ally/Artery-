"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  isConnected: (artistId: string) => boolean;
  addConnectedArtist: (artistId: string) => void;
}

// MOCK_USER is only used during development while Supabase env vars are not set.
// Once you add NEXT_PUBLIC_SUPABASE_URL to .env.local, replace the login page's
// setUser(MOCK_USER) call with real Supabase session data.
export const MOCK_USER: User = {
  id: "user_001",
  phone: "+919999888877",
  countryCode: "+91",
  name: "Art Enthusiast",
  subscription: "pro",
  savedImages: ["img_001", "img_002"],
  connectedArtists: ["artist_001"],
  createdAt: "2024-11-01T00:00:00Z",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        // Clear the httpOnly session cookie so middleware stops protecting routes
        fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      },
      isConnected: (artistId) => {
        const { user } = get();
        return user?.connectedArtists?.includes(artistId) ?? false;
      },
      addConnectedArtist: (artistId) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                connectedArtists: [...(state.user.connectedArtists ?? []), artistId],
              }
            : null,
        }));
      },
    }),
    { name: "artery-auth" }
  )
);
