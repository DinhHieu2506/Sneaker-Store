import { useState, useEffect, useRef } from "react";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../../zustand/cart";
import { useWishlistStore } from "../../zustand/wishlist";
import { useAuthStore } from "../../zustand/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Header() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // ✅ handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery(""); // reset input sau khi submit
    }
  };

  // ✅ handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center space-x-2" to="/">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl">SneakerHub</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
            <Link to="/products?gender=Men" className="text-sm font-medium hover:text-primary transition-colors">
              Men
            </Link>
            <Link to="/products?gender=Women" className="text-sm font-medium hover:text-primary transition-colors">
              Women
            </Link>
            <Link to="/products?featured=true" className="text-sm font-medium hover:text-primary transition-colors">
              Featured
            </Link>
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-8 md:text-sm"
                placeholder="Search sneakers..."
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-2 relative">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative inline-flex items-center justify-center h-10 w-10 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {wishlist.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cart.length}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>

            {/* User / Login */}
            {!user ? (
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center h-9 px-3 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="cursor-pointer inline-flex items-center justify-center h-10 px-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    {user.firstName || user.email.split("@")[0]}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border bg-background shadow-lg">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        navigate("/");
                        toast.success("Logged out successfully");
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
