import { ShoppingBag, Heart } from "lucide-react";

type LoginPromptProps = {
  feature?: "cart" | "wishlist";
};

const LoginPrompt = ({ feature = "cart" }: LoginPromptProps) => {
  const isCart = feature === "cart";
  const Icon = isCart ? ShoppingBag : Heart;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-8">
          You need to login to view your {isCart ? "cart" : "wishlist"}
        </p>
        <a
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
                     bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          href="/auth/login"
        >
          Login
        </a>
      </div>
    </main>
  );
};

export default LoginPrompt;
