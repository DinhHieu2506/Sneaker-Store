import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";
import { useWishlistStore } from "./wishlist";
import { useCartStore } from "./cart";
import { useProductsStore } from "./products";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
}

type LoginResponse = {
  data?: { token?: string; user?: any };
  token?: string;
  user?: any;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  register: (
    payload: Omit<User, "id"> & { password: string }
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}


function normalizeUser(apiUser: any): User {
  if (!apiUser) throw new Error("Missing user in response");
  return {
    id: apiUser.id ?? apiUser._id ?? "",
    email: apiUser.email ?? "",
    firstName: apiUser.firstName ?? apiUser.givenName ?? "",
    lastName: apiUser.lastName ?? apiUser.familyName ?? "",
    phone: apiUser.phone ?? apiUser.phoneNumber ?? "",
    address: apiUser.address ?? {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  };
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,


      register: async (payload) => {
        try {
          set({ loading: true, error: null });
         
          await api.post("/auth/register", payload);
          set({ loading: false });
          return true;
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Registration failed";
          set({ error: msg, loading: false });
          return false;
        }
      },

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const res = await api.post<LoginResponse>("/auth/login", {
            email,
            password,
          });

          const block = res.data?.data ?? res.data;
          const token = block?.token;
          const apiUser = block?.user;

          if (!token || !apiUser) throw new Error("Invalid login response");

          const user = normalizeUser(apiUser);

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });


          const { fetchWishlist } = useWishlistStore.getState();
          const { fetchCart } = useCartStore.getState();
          const { fetchProducts } = useProductsStore.getState();

          fetchWishlist();
          fetchCart();
          fetchProducts();

          return true;
        } catch (err: any) {
          const msg =
            err?.response?.data?.message || err?.message || "Login failed";
          set({
            error: msg,
            loading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false, error: null });
          return false;
        }
        try {
          set({ loading: true, error: null });

          const res = await api.get("/me");
          const user = normalizeUser(res.data?.data ?? res.data);
          set({ user, isAuthenticated: true, loading: false });
          return true;
        } catch (err: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: "Session expired",
          });
          return false;
        }
      },


      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
        useWishlistStore.getState().clearWishlist();
        useCartStore.getState().clearCart();
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),

      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
      version: 1,
    }
  )
);
