import { ShoppingBag, Heart } from "lucide-react";

type EmptyStateProps = {
  feature?: "cart" | "wishlist";
};

const EmptyState = ({ feature = "cart" }: EmptyStateProps) => {
  const isCart = feature === "cart";
  const Icon = isCart ? ShoppingBag : Heart;

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">
          Your {isCart ? "cart" : "wishlist"} is empty
        </h1>
        <p className="text-muted-foreground mb-6">
          {isCart
            ? "Add items to your cart to start checkout"
            : "Save items you love to your wishlist"}
        </p>
        <a
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
                     bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          href="/products"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
};

export default EmptyState;
