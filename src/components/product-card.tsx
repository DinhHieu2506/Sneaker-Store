import React from "react";
import { useWishlistStore } from "../zustand/wishlist";
import { useAuthStore } from "../zustand/auth"; // 👈 import thêm auth store
import HeartIcon from "./ui/icon/heart";
import { toast } from "sonner";

type Color = {
  _id: string;
  name: string;
  hexCode: string;
};

type ProductCardProps = {
  id: string;
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
  const { user, token } = useAuthStore(); // 👈 lấy user/token
  const { addToWishlist, removeFromWishlist, getWishlistItemById } =
    useWishlistStore();
  const isInWishlist = !!getWishlistItemById(id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("You need to login to use wishlist ❤️");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(id);
        toast.success("Removed from wishlist ❤️‍🩹");
      } else {
        await addToWishlist({ productId: id, name, imageUrl, price });
        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm group hover:shadow-lg overflow-hidden">
      <a href={`/products/${id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={imageUrl}
          />
          <button
            onClick={handleWishlistToggle}
            className={`h-10 w-10 absolute top-2 right-2 flex items-center justify-center rounded-md bg-white/90 shadow cursor-pointer
              ${isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"}
            `}
          >
            <HeartIcon filled={isInWishlist} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">{brand}</p>
          <h3 className="font-semibold line-clamp-2">{name}</h3>
          <p className="text-lg font-bold mt-2">${price}</p>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
