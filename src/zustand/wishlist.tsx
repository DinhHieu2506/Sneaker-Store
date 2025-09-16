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
  ids: Record<string, true>;
  loading: boolean;
  error: string | null;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  getWishlistItemById: (productId: string) => WishlistItem | null;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

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

const buildIds = (list: WishlistItem[]) => {
  const ids: Record<string, true> = {};
  for (const it of list) ids[String(it.productId)] = true;
  return ids;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  allWishlist: [],
  ids: {},
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
        new Map(mapped.map((it) => [String(it.productId), it])).values()
      );

      set({
        wishlist: uniqueByProduct,
        allWishlist: uniqueByProduct,
        ids: buildIds(uniqueByProduct),
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
    const pid = String(product.productId);
    if (get().ids[pid]) return;

    const optimisticItem: WishlistItem = {
      productId: pid,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    };

    set((state) => ({
      wishlist: [...state.wishlist, optimisticItem],
      ids: { ...state.ids, [pid]: true },
      error: null,
    }));

    try {
      const res = await api.post(`/wishlist/items/${pid}`);
      const serverItemRaw =
        res?.data?.data?.item || res?.data?.data || res?.data;
      const serverItem = mapWishlistItem(serverItemRaw);
      const serverPid = String(serverItem.productId || pid);

      set((state) => {
        const wishlist = state.wishlist.map((it) =>
          String(it.productId) === pid
            ? { ...serverItem, productId: serverPid }
            : it
        );

        const ids = { ...state.ids };
        if (serverPid !== pid) {
          delete ids[pid];
          ids[serverPid] = true;
        }

        return {
          wishlist,
          allWishlist: wishlist,
          ids,
        };
      });
    } catch (err: any) {
      console.error(
        "Add to wishlist error:",
        err?.response?.data || err?.message
      );
      // rollback
      set((state) => {
        const wishlist = state.wishlist.filter(
          (it) => String(it.productId) !== pid
        );
        const { [pid]: _, ...rest } = state.ids;
        return {
          wishlist,
          ids: rest,
          error: "Failed to add to wishlist",
        };
      });
      throw err;
    }
  },

  removeFromWishlist: async (productId) => {
    const pid = String(productId);

    const prevItem = get().wishlist.find((it) => String(it.productId) === pid);

    set((state) => {
      const wishlist = state.wishlist.filter(
        (it) => String(it.productId) !== pid
      );
      const { [pid]: _, ...rest } = state.ids;
      return { wishlist, ids: rest, error: null };
    });

    try {
      await api.delete(`/wishlist/items/${pid}`);
    } catch (err: any) {
      if (prevItem?.wishlistItemId) {
        try {
          await api.delete(`/wishlist/items/${prevItem.wishlistItemId}`);
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

      set((state) => ({
        wishlist: prevItem ? [...state.wishlist, prevItem] : state.wishlist,
        ids: prevItem ? { ...state.ids, [pid]: true } : state.ids,
        error: "Failed to remove from wishlist",
      }));
    }
  },

  clearWishlist: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete("/wishlist");
      set({
        wishlist: [],
        allWishlist: [],
        ids: {},
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error(
        "Clear wishlist error:",
        err?.response?.data || err?.message
      );
      set({ error: "Failed to clear wishlist", loading: false });
    }
  },

  getWishlistItemById: (productId: string) => {
    const pid = String(productId);
    const { wishlist } = get();
    return wishlist.find((it) => String(it.productId) === pid) || null;
  },

  isInWishlist: (productId: string) => {
    return !!get().ids[String(productId)];
  },
}));
