import { create } from "zustand";
import api from "../services/api";

export type CartProductLite = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export type CartItem = {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  product?: CartProductLite;
};

interface CartState {
  cart: CartItem[];
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (input: {
    id: string;
    size: string;
    quantity: number;
  }) => Promise<void>;
  updateQuantity: (itemId: string, qty: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  getTotalItems: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getGrandTotal: () => number;
}

const mapCartItem = (raw: any): CartItem => ({
  id: raw._id ?? raw.id ?? "",
  productId: raw.sneaker?._id ?? "",
  size: raw.size,
  quantity: Number(raw.quantity ?? 0),
  product: raw.sneaker
    ? {
        id: raw.sneaker._id,
        name: raw.sneaker.name,
        price: Number(raw.price ?? raw.sneaker.price ?? 0),
        imageUrl:
          raw.sneaker.imageUrl ??
          raw.sneaker.images?.find((i: any) => i.isPrimary)?.url ??
          raw.sneaker.images?.[0]?.url ??
          "",
      }
    : undefined,
});

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  /** Lấy giỏ hàng */
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/cart");

      const items = res.data?.data?.cart?.items ?? [];
      set({ cart: items.map(mapCartItem), loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch cart",
        loading: false,
      });
    }
  },

  /** Thêm vào giỏ */
  addToCart: async ({ id, size, quantity }) => {
    set({ loading: true, error: null });
    try {
      await api.post("/cart/items", {
        sneakerId: id,
        size,
        quantity,
      });
      await get().fetchCart();
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to add to cart",
        loading: false,
      });
    }
  },

  /** Cập nhật số lượng */
  updateQuantity: async (itemId, qty) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === itemId ? { ...item, quantity: qty } : item
      ),
      error: null,
    }));

    try {
      await api.put(`/cart/items/${itemId}`, { quantity: qty });

      await get().fetchCart();
    } catch (err: any) {
      // Nếu fail thì rollback
      await get().fetchCart();
      set({
        error: err?.message || "Failed to update quantity",
      });
    }
  },

  /** Xoá 1 item */
  removeFromCart: async (itemId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
    } catch (err: any) {
      set({
        error: err?.message || "Failed to remove item",
        loading: false,
      });
    }
  },

  /** Xoá toàn bộ giỏ */
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete("/cart");
      set({ cart: [], loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to clear cart",
        loading: false,
      });
    }
  },

  /** ---- Helpers ---- */
  getTotalItems: () => {
    const cart = get().cart ?? [];
    return cart.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  },

  getSubtotal: () => {
    const cart = get().cart ?? [];
    return cart.reduce((sum, it) => {
      const price = Number(it.product?.price ?? 0);
      const qty = Number(it.quantity ?? 0);
      return sum + price * qty;
    }, 0);
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 ? 30000 : 0;
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShipping();
    return subtotal + shipping;
  },
}));
