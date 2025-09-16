import { useEffect } from "react";
import { useCartStore } from "../../zustand/cart";
import { useAuthStore } from "../../zustand/auth";
import LoginPrompt from "../../components/layouts/LoginPromt";
import { Trash2 } from "lucide-react";
import EmptyState from "@/components/layouts/EmtyState";
import { toast } from "sonner";

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

export default function CartPage() {
  const { user, token } = useAuthStore();
  const { cart, loading, fetchCart } = useCartStore(); // lấy thêm loading

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  if (!user || !token) {
    return <LoginPrompt />;
  }

  if (!loading && !cart.length) {
    return <EmptyState feature="cart" />;
  }

  return <CartPageInner />;
}

function CartPageInner() {
  const { cart, removeFromCart, clearCart, updateQuantity, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6 flex items-center space-x-4">
                <div className="w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={item.product?.imageUrl || "/placeholder.png"}
                    alt={item.product?.name || "Unknown"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.product?.name || "Unknown Product"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size}
                  </p>
                  <p className="font-bold">
                    ${item.product?.price?.toFixed(2) ?? "0.00"}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center space-x-2">
                  <button
                    className="border h-10 w-10 rounded-md cursor-pointer hover:bg-gray-100 active:scale-90 disabled:opacity-50"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="border h-10 w-10 rounded-md cursor-pointer hover:bg-gray-100 active:scale-90"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="ml-4 text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remove item from cart?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The product will be
                        removed from your cart permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              {/* Clear Cart with confirm */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="border px-4 py-2 rounded-md hover:bg-accent cursor-pointer">
                    Clear Cart
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear entire cart?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All products will be
                      permanently removed from your cart.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 "
                      onClick={async () => {
                        try {
                          await clearCart();
                          toast.success("Cart cleared ");
                        } catch {
                          toast.error("Failed to clear cart");
                        }
                      }}
                    >
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <a
                href="/products"
                className="border px-4 py-2 rounded-md hover:bg-accent"
              >
                Continue Shopping
              </a>
            </div>
          )}
        </div>


        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="block text-center bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-md mt-4"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
