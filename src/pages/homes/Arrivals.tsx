import { useEffect } from "react";
import { useProductsStore } from "../../zustand/products";
import ProductCard from "../../components/ProductCard"; 
import { Link } from "react-router-dom";

export default function Arrivals() {
  const {
    products = [],
    fetchArrivalsProducts,
    loading,
    error,
  } = useProductsStore();

  useEffect(() => {
    fetchArrivalsProducts();
  }, [fetchArrivalsProducts]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest sneakers freshly added to our collection
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center">No new arrivals found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  id={product.id}
                  imageUrl={product.imageUrl}
                  brand={product.brand}
                  name={product.name}
                  price={product.price}
                />

                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 absolute top-2 right-12">
                  Out of Stock
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8"
            to="/products?arrivals=true"
          >
            View All Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
