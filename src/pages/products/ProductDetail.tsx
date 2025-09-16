import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import HeartIcon from "../../components/ui/icon/heart";
import ShoppingCartIcon from "../../components/ui/icon/shopping";
import { useAuthStore } from "../../zustand/auth";
import { useCartStore } from "../../zustand/cart";
import { useProductsStore, type Product } from "../../zustand/products";
import { useWishlistStore } from "../../zustand/wishlist";

type ProductSize = { _id: string; size: string; stock: number };

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { products, fetchProducts, loading } = useProductsStore();
  const { cart, addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, getWishlistItemById } =
    useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  useEffect(() => {
    if (id && products.length) {
      const found = products.find((p) => p.id === id);
      setProduct(found || null);
    }
  }, [id, products]);

  useEffect(() => {
    if (product) {
      if (product.colors?.length > 0) {
        setSelectedColor(product.colors[0].name);
      } else {
        setSelectedColor(null);
      }

      if (typeof product.sizes !== "string") {
        const availableSize = (product.sizes as unknown as ProductSize[]).find(
          (s) => s.stock > 0
        );
        setSelectedSize(availableSize ? availableSize.size : null);
      } else setSelectedSize(product.sizes?.[0] || null);

      setQuantity(1);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">Product not found.</div>
    );
  }

  const selectedSizeStock =
    (product.sizes as ProductSize[] | undefined)?.find(
      (s) => s.size === selectedSize
    )?.stock || 0;

  const isInWishlist = !!getWishlistItemById(product.id);

  const handleChangeSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleChangeColor = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < selectedSizeStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (!product || !selectedSize) return;

    try {
      setAdding(true);

      const existingItem = cart.find(
        (item) => item.productId === product.id && item.size === selectedSize
      );

      await addToCart({
        id: product.id,
        size: selectedSize,
        quantity,
      });

      if (existingItem) {
        toast.success(
          `Updated quantity of ${product.name} (size ${selectedSize}) 🛒`
        );
      } else {
        toast.success(
          `Added ${quantity} ${product.name} (size ${selectedSize}) 🛒`
        );
      }
    } catch {
      toast.error("Failed to add to cart ❌");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (!product) return;
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.success("Removed from wishlist ❤️‍🩹");
      } else {
        await addToWishlist({
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
        });
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button className="aspect-square rounded-lg border-2 overflow-hidden border-primary">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold">${product.price}</span>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.colors?.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleChangeColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      selectedColor === c.name
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.hexCode }}
                    title={c.name}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedColor}
                </p>
              )}
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s: any) => (
                  <button
                    key={s._id}
                    onClick={() => handleChangeSize(s.size)}
                    disabled={s.stock === 0}
                    className={`py-2 px-3 border rounded-md text-center cursor-pointer ${
                      selectedSize === s.size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    } ${s.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedSizeStock} in stock
                </p>
              )}
            </div>
          )}

          {selectedSize && (
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-10 h-10 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100 active:scale-90"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-10 h-10 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100 active:scale-90"
                  disabled={quantity >= selectedSizeStock}
                >
                  +
                </button>
                <span className="text-sm text-muted-foreground ml-2">
                  Max: {selectedSizeStock}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full disabled:opacity-50 cursor-pointer"
              disabled={!selectedSize || selectedSizeStock === 0 || adding}
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon />
              {!user
                ? "Login to buy"
                : selectedSizeStock === 0
                ? "Out of Stock"
                : adding
                ? "Adding..."
                : "Add to cart"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className="inline-flex items-center justify-center gap-2 border h-11 rounded-md px-8 w-full bg-transparent hover:bg-accent cursor-pointer"
            >
              <HeartIcon filled={isInWishlist} />
              {user
                ? isInWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
                : "Login to use wishlist"}
            </button>
          </div>

          <div className="border rounded-lg p-4 mt-6">
            <h2 className="font-semibold mb-4">Product Details</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span>{product.brand}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span>{product.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{product.category || "-"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span>{product.gender || "-"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Available Colors:</span>
                <span>
                  {product.colors?.map((c) => c.name).join(", ") || "-"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Available Sizes:</span>
                <span>
                  {product.sizes?.map((s: any) => s.size).join(", ") || "-"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        {relatedProducts.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="rounded-lg border p-4 hover:shadow"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="aspect-square object-cover rounded-md mb-3"
                />
                <p className="text-sm text-muted-foreground">{p.brand}</p>
                <h3 className="font-medium">{p.name}</h3>
                <p className="font-bold">${p.price}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">Product not found.</div>
        )}
      </section>
    </div>
  );
}
