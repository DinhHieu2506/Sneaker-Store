// src/zustand/wishlist.ts
import { create } from "zustand";
import api from "../services/api";

export type WishlistItem = {
  productId: string;

  wishlistItemId?: string;
  name: string;
  imageUrl: string;
  price: number;
};

interface WishlistState {
  wishlist: WishlistItem[];
  allWishlist: WishlistItem[];
  loading: boolean;
  error: string | null;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  getWishlistItemById: (productId: string) => WishlistItem | null;
  clearWishlist: () => void;
}

/** Map helpers */
const mapWishlistItem = (item: any): WishlistItem => {
  const product = item?.product || item?.sneaker || item?.productInfo || {};

  const productId =
    item?.productId || product?._id || product?.id || product?.productId || "";

  return {
    productId: String(productId),
    wishlistItemId: item?._id || item?.wishlistItemId,
    name: product?.name || item?.name || "",
    imageUrl:
      item?.imageUrl ||
      product?.images?.find((img: any) => img?.isPrimary)?.url ||
      product?.images?.[0]?.url ||
      "",
    price:
      typeof item?.price === "number"
        ? item.price
        : typeof product?.price === "number"
        ? product.price
        : 0,
  };
};

const mapWishlistItems = (items: any[] = []): WishlistItem[] =>
  items.map(mapWishlistItem);

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  allWishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/wishlist");

      const items =
        res?.data?.data?.wishlist?.items ||
        res?.data?.data?.items ||
        res?.data?.wishlist?.items ||
        res?.data?.items ||
        [];
      const mapped = mapWishlistItems(items);

      const uniqueByProduct = Array.from(
        new Map(mapped.map((it) => [it.productId, it])).values()
      );

      set({
        wishlist: uniqueByProduct,
        allWishlist: uniqueByProduct,
        loading: false,
      });
    } catch (err: any) {
      console.error(
        "Fetch wishlist error:",
        err?.response?.data || err?.message
      );
      set({ error: "Failed to fetch wishlist", loading: false });
    }
  },

  addToWishlist: async (product) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/wishlist/items/${product.productId}`);
      const newItem = mapWishlistItem(
        res?.data?.data?.item || res?.data?.data || res?.data
      );
      set((state) => ({
        wishlist: [...state.wishlist, newItem],
        loading: false,
      }));
    } catch (err: any) {
      console.error(
        "Add to wishlist error:",
        err?.response?.data || err?.message
      );
      set({ error: "Failed to add to wishlist", loading: false });
    }
  },

  removeFromWishlist: async (productId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/wishlist/items/${productId}`);
      set((state) => ({
        wishlist: state.wishlist.filter((it) => it.productId !== productId),
        loading: false,
      }));
    } catch (err: any) {
      const item = get().wishlist.find((it) => it.productId === productId);
      if (item?.wishlistItemId) {
        try {
          await api.delete(`/wishlist/items/${item.wishlistItemId}`);
          set((state) => ({
            wishlist: state.wishlist.filter((it) => it.productId !== productId),
            loading: false,
          }));
          return;
        } catch (err2: any) {
          console.error(
            "Remove (fallback by wishlistItemId) error:",
            err2?.response?.data || err2?.message
          );
        }
      }
      console.error(
        "Remove from wishlist error:",
        err?.response?.data || err?.message
      );
      set({ error: "Failed to remove from wishlist", loading: false });
    }
  },

  clearWishlist: () => set({ wishlist: [], loading: false, error: null }),

  getWishlistItemById: (productId: string) => {
    const { wishlist } = get();
    return wishlist.find((it) => it.productId === productId) || null;
  },
}));
