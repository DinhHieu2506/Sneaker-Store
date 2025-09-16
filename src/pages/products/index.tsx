import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductsStore } from "../../zustand/products";
import ProductCard from "../../components/product-card";
import SortProduct from "./components/sort-product";

export default function Products() {
  const {
    products,
    loading,
    fetchProducts,
    fetchFeaturedProducts,
    applyFilters,
    searchProducts,
  } = useProductsStore();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const brands = searchParams.getAll("brand");
    const categories = searchParams.getAll("category");
    const genders = searchParams.getAll("gender");
    const sizes = searchParams.getAll("size");
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 500;
    const isFeatured = searchParams.get("featured") === "true"; 

    if (searchQuery) {
      searchProducts(searchQuery);
    } else if (isFeatured) {
      fetchFeaturedProducts(); 
    } else if (
      brands.length ||
      categories.length ||
      genders.length ||
      sizes.length ||
      searchParams.has("minPrice") ||
      searchParams.has("maxPrice")
    ) {
      applyFilters({
        brands,
        categories,
        genders,
        sizes,
        priceRange: [minPrice, maxPrice],
      });
    } else {
      fetchProducts(); 
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SortProduct />

          <main className="flex-1 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {searchParams.get("featured") === "true"
                  ? "Featured Products"
                  : "All Products"}
              </h1>
              <p>{products?.length || 0} products found</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(products) && products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </main>
  );
}
