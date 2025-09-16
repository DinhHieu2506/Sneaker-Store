import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import LoginPrompt from "../../components/layouts/LoginPromt";

import { useAuthStore } from "../../zustand/auth";
import { useWishlistStore } from "../../zustand/wishlist";
import EmptyState from "@/components/layouts/EmtyState";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

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

  if (!token || !user) return <LoginPrompt feature="wishlist" />;
  if (!wishlist.length) {
    return <EmptyState feature="wishlist" />;
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlist.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border px-4 py-2 rounded-md hover:bg-accent"
                >
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all products from your wishlist. You cannot
                    undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await clearWishlist();
                        toast.success("Wishlist cleared ");
                      } catch {
                        toast.error("Failed to clear wishlist");
                      }
                    }}
                  >
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="rounded-lg border bg-card text-card-foreground shadow-sm group hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Link to={`/products/${item.productId}`}>
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
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white h-10 w-10 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove item?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove{" "}
                        <span className="font-semibold">{item.name}</span> from
                        your wishlist?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            await removeFromWishlist(item.productId);
                            toast.success("Removed from wishlist ❤️‍🩹");
                          } catch {
                            toast.error("Failed to remove item");
                          }
                        }}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="p-4">
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                </Link>
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
