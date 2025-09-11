import { useEffect } from "react";
import { useProductsStore } from "../../zustand/products";
import { Link } from "react-router-dom";
import categoryImages from "../../utils/categoryImages";

export default function Category() {
  const { categories, fetchCategories } = useProductsStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect sneakers for every activity and style
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const fallbackImage =
              categoryImages[cat] 

            return (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="group relative block rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={fallbackImage}
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-xl font-semibold">
                    {cat}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
