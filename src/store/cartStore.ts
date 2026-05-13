"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Artist, GeneratedImage } from "@/types";

interface CartEntry {
  item: CartItem;
  artist: Artist;
  image: GeneratedImage;
}

interface CartStore {
  entries: CartEntry[];
  addToCart: (item: CartItem, artist: Artist, image: GeneratedImage) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      entries: [],
      addToCart: (item, artist, image) => {
        const exists = get().entries.some((e) => e.artist.id === artist.id);
        if (!exists) {
          set((state) => ({ entries: [...state.entries, { item, artist, image }] }));
        }
      },
      removeFromCart: (itemId) => {
        set((state) => ({ entries: state.entries.filter((e) => e.item.id !== itemId) }));
      },
      clearCart: () => set({ entries: [] }),
      totalItems: () => get().entries.length,
      totalAmount: () =>
        get().entries.reduce((sum, e) => sum + e.item.commissionFee + e.item.deliveryCharge, 0),
    }),
    { name: "artery-cart" }
  )
);
