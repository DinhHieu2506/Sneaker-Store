import { create } from "zustand";
import api from "../services/api";

export type Color = { _id: string; name: string; hexCode: string };

export type Product = {
  id: string;
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  colors: Color[];
  description: string;
  category?: string;
  gender?: string;
  isFeatured?: boolean;
  sizes?: string[];
};

interface ProductsState {
  products: Product[];
  allProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchArrivalsProducts: () => Promise<void>;

  fetchProductsByGender: (gender: "Men" | "Women") => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => void;
  applyFilters: (filters: {
    brands: string[];
    categories: string[];
    genders: string[];
    sizes: string[];
    priceRange: number[];
    search: string
  }) => void;
  clearFilters: () => void;

  getProductById: (id: string) => Product | null;
}

const mapProduct = (item: any): Product => ({
  id: item._id,
  name: item.name,
  brand: item.brand,
  price: item.price,
  description: item.description,
  imageUrl:
    item.images?.find((img: any) => img.isPrimary)?.url ||
    item.images?.[0]?.url ||
    "",
  colors: (item.colors || []).map((c: any) => ({
    _id: c._id,
    name: c.name,
    hexCode: c.hexCode,
  })),
  category: item.category,
  gender: item.gender,
  isFeatured: item.isFeatured,
  sizes: item.sizes || [],
});

const mapProducts = (items: any[]): Product[] => items.map(mapProduct);

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  allProducts: [],
  categories: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/products");
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);

      const categories: string[] = Array.from(
        new Set(mapped.map((item) => item.category?.trim() || "Other"))
      );

      set({
        products: mapped,
        allProducts: mapped,
        categories,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/products?featured=true");
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);

      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch featured products",
        loading: false,
      });
    }
  },

  fetchArrivalsProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/products/new/arrivals");
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);
      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch arrivals",
        loading: false,
      });
    }
  },

  fetchProductsByGender: async (gender: "Men" | "Women") => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/products?gender=${gender}`);
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);

      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch by gender",
        loading: false,
      });
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/products?category=${category}`);
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);

      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch by category",
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/products");
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);
      const categories: string[] = Array.from(
        new Set(mapped.map((item) => item.category?.trim() || "Other"))
      );

      set({ categories, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch categories",
        loading: false,
      });
    }
  },

  searchProducts: (query: string) => {
    const { allProducts } = get();
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      set({ products: allProducts });
      return;
    }
    const filtered = allProducts.filter((item) =>
      [item.name, item.brand].some((field) =>
        field?.toLowerCase().includes(normalized)
      )
    );

    set({ products: filtered });
  },

  applyFilters: async ({ brands, categories, genders, sizes, priceRange, search }) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();

      if (brands.length) {
        brands.forEach((b) => params.append("brand", b));
      }
      if (categories.length) {
        categories.forEach((c) => params.append("category", c));
      }
      if (genders.length) {
        genders.forEach((g) => params.append("gender", g));
      }
      if (sizes.length) {
        sizes.forEach((s) => params.append("size", String(s)));
      }
      if (priceRange.length === 2) {
        params.append("minPrice", String(priceRange[0]));
        params.append("maxPrice", String(priceRange[1]));
      }
      if (search.trim()) {
        params.append("search", search.trim());
      }

      const res = await api.get(`/products?${params.toString()}`);
      const sneakers = res.data.data?.sneakers || [];
      const mapped = mapProducts(sneakers);

      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to apply filters",
        loading: false,
      });
    }
  },

  clearFilters: async () => {
    await get().fetchProducts();
  },

  getProductById: (id: string) => {
    const { allProducts } = get();
    return allProducts.find((p) => p.id === id) || null;
  },
}));
