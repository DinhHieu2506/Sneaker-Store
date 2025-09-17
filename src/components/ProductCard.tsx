import React, { useState } from "react";
import { useWishlistStore } from "../zustand/wishlist";
import { useAuthStore } from "../zustand/auth";
import HeartIcon from "./ui/icon/heart";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Color = { _id: string; name: string; hexCode: string };

type ProductCardProps = {
  id: string | number;
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  colors?: Color[];
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  brand,
  name,
  price,
  colors = [],
}) => {
  const pid = String(id);
  const { user, token } = useAuthStore();

  const liked = useWishlistStore((s) => !!s.ids[pid]);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  const [pending, setPending] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("You need to login to use wishlist ❤️");
      return;
    }

    try {
      setPending(true);
      if (liked) {
        await removeFromWishlist(pid);
        toast.success("Removed from wishlist ❤️‍🩹");
      } else {
        await addToWishlist({ productId: pid, name, imageUrl, price });
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm group hover:shadow-lg overflow-hidden">
      <Link to={`/products/${pid}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={imageUrl}
          />
          <button
            onClick={handleWishlistToggle}
            disabled={pending}
            aria-pressed={liked}
            className={`h-10 w-10 absolute top-2 right-2 flex items-center justify-center rounded-md bg-white/90 shadow cursor-pointer disabled:opacity-60
              ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}
            `}
          >
            <HeartIcon filled={liked} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {brand}
          </p>
          <h3 className="font-semibold line-clamp-2">{name}</h3>

          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold">${price}</p>

            {colors.length > 0 && (
              <div className="flex gap-1">
                {colors.slice(0, 3).map((c) => (
                  <span
                    key={c._id}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.hexCode }}
                    title={c.name}
                  />
                ))}

                {colors.length > 3 && (
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] bg-gray-100 text-gray-600">
                    +{colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
