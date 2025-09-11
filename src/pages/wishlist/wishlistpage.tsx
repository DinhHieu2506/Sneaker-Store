import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";

import { useAuthStore } from "../../zustand/auth";
import { useWishlistStore } from "../../zustand/wishlist";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0
  );

export default function WishlistPage() {
  const { user, token } = useAuthStore();
  const {
    wishlist,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
    loading,
  } = useWishlistStore();

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token, fetchWishlist]);

  if (!token || !user) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            Please sign in to view your wishlist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} items saved
            </p>
          </div>

          {wishlist.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="border px-4 py-2 rounded-md hover:bg-accent"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Empty state */}
        {!loading && wishlist.length === 0 && (
          <div className="text-center text-gray-500 py-24">
            Your wishlist is empty.
          </div>
        )}

 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="rounded-lg border bg-card text-card-foreground shadow-sm group hover:shadow-lg transition-shadow"
            >

              <Link to={`/products/${item.productId}`} className="block p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  {item.imageUrl ? (
                    <img
                      alt={item.name || "Product image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={item.imageUrl}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white h-10 w-10 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.productId);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                <p className="text-lg font-bold mt-2">
                  {formatCurrency(item.price)}
                </p>

                <div className="space-y-2 mt-4">
                  <Button className="w-full" asChild>
                    <Link to={`/products/${item.productId}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
