import React, { useState } from "react";
import { useWishlistStore } from "../zustand/wishlist";
import { useAuthStore } from "../zustand/auth";
import HeartIcon from "./ui/icon/heart";
import { toast } from "sonner";

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
}) => {
  const pid = String(id);
  const { user, token } = useAuthStore();

  // 👉 Theo dõi membership qua ids map để re-render siêu ổn định
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
      <a href={`/products/${pid}`} className="block">
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
          <p className="text-lg font-bold mt-2">${price}</p>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
