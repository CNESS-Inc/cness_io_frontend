import React, { useEffect, useState } from "react";
import {
  Star,
  ArrowRight,
  Heart,
  Video,
  Clock,
  Music,
  BookOpen,
  FileAudio,
  FileText,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast/ToastProvider";
import {
  AddProductToCart,
  AddProductToWishlist,
  RemoveProductToCart,
  RemoveProductToWishlist,
} from "../../Common/ServerAPI";
import { FiShoppingCart } from "react-icons/fi";
import { useCartWishlist } from "./context/CartWishlistContext";

interface Product {
  id: string;
  image: string;
  previewVideo?: string;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  currentPrice: number;
  discount?: number;
  duration: string;
  category: string;
  mood_icon?: any;
  mood?: string;
  isLike?: boolean;
  isCarted?: boolean;
}

interface ProductCardProps {
  product: Product;
  onWishlistUpdate?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onWishlistUpdate,
}) => {
  const [liked, setLiked] = useState(false);
  const [carted, setCarted] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const {
    incrementCart,
    decrementCart,
    incrementWishlist,
    decrementWishlist,
    updateCartCount,
    updateWishlistCount,
  } = useCartWishlist();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (product?.isLike !== undefined) {
      setLiked(product?.isLike);
    }
    if (product?.isCarted !== undefined) {
      setCarted(product?.isCarted);
    }
  }, []);

  const handleCardClick = () => {
    navigate(`/dashboard/product-detail/${product.id}`, { state: { product } });
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAddingToWishlist) return;

    setIsAddingToWishlist(true);

    try {
      if (liked) {
        await RemoveProductToWishlist(product.id);
        setLiked(false);
        showToast({
          message: "Removed from wishlist",
          type: "success",
          duration: 2000,
        });
        await decrementWishlist();
      } else {
        await AddProductToWishlist({ product_id: product.id });
        setLiked(true);
        showToast({
          message: "Added to wishlist ❤️",
          type: "success",
          duration: 2000,
        });
        await incrementWishlist();
      }

      await updateWishlistCount();
      if (onWishlistUpdate) {
        onWishlistUpdate();
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update wishlist",
        type: "error",
        duration: 3000,
      });

      // ✅ Revert the liked state on error
      setLiked((prevState) => !prevState);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      if (carted) {
        await RemoveProductToCart(product.id);
        setCarted(false);
        showToast({
          message: "Removed from cart",
          type: "success",
          duration: 2000,
        });
        await decrementCart();
      } else {
        await AddProductToCart({
          product_id: product.id,
          quantity: 1,
        });
        setCarted(true);
        showToast({
          message: "Added to cart",
          type: "success",
          duration: 2000,
        });
        await incrementCart();
      }
      await updateCartCount();
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to add to cart",
        type: "error",
        duration: 3000,
      });

      setCarted((prevState) => !prevState);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await AddProductToCart({
        product_id: product.id,
        quantity: 1,
      });
      navigate("/dashboard/checkout");
    } catch (error: any) {
      console.error("Buy now error:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Failed to proceed",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getCategoryIconLarge = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      Video: <Video className="w-4 h-4 text-gray-800" />,
      Music: <Music className="w-4 h-4 text-gray-800" />,
      Course: <BookOpen className="w-4 h-4 text-gray-800" />,
      Podcast: <FileAudio className="w-4 h-4 text-gray-800" />,
      eBook: <FileText className="w-4 h-4 text-gray-800" />,
      Art: <Palette className="w-4 h-4 text-gray-800" />,
    };

    return (
      iconMap[categoryName] || <BookOpen className="w-4 h-4 text-gray-800" />
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-300 rounded-[14px]
        overflow-hidden cursor-pointer flex flex-col 
        hover:shadow-lg transition-transform hover:scale-[1.02]

        /* Responsive card width */
        w-full
        max-w-[300px]
        lg:max-w-[300px]                         /* desktop */
        sm:max-w-[260px]        /* small tablets */
        xs:max-w-[210px]        /* phones below 500px */
        
        /* Let height scale automatically */
        h-auto
      "
    >
      {/* Product Image */}
      <div className="relative w-full aspect-266/149 rounded-t-[14px] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={handleWishlistToggle}
          disabled={isAddingToWishlist}
          className={`absolute top-3 right-3 z-30 flex items-center justify-center transition-transform duration-300 hover:scale-110 rounded-full p-1 ${
            isAddingToWishlist ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Heart
            className={`w-7 h-7 transition-colors duration-300 ${
              liked
                ? "text-red-500 fill-red-500"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="bg-purple-50 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
            {product.mood_icon} {product.mood}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-[#7077FE] fill-[#7077FE]" />
            <span className="text-xs font-semibold text-gray-800">
              {product?.rating} ({product?.reviews})
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm md:text-base text-gray-800 leading-tight mb-1 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">
            {product.author}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount && product?.discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                ${product.currentPrice}
              </span>
              {product.discount && product?.discount > 0 && (
                <span className="text-xs text-blue-500">
                  ({product.discount}%)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 w-full justify-end">
            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex items-center justify-center 
     
                hover:bg-blue-50 transition-transform hover:scale-110

                w-7 h-7        /* mobile */
                sm:w-8 sm:h-8  /* tablet */
                md:w-8 md:h-8  /* desktop */
              "
            >
              <FiShoppingCart
                className={`w-4 h-4 ${
                  carted ? "text-[#7077FE] fill-[#7077FE]" : "text-[#7077FE]"
                }`}
              />
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="
                relative bg-[#7077FE] text-white rounded-full font-semibold flex items-center
                overflow-hidden group whitespace-nowrap shrink

                h-8 px-3
                sm:h-8 sm:px-4
                md:h-9 md:px-4

                text-[10px] sm:text-[11px] md:text-[11px]
              "
            >
              {/* Text that can shrink */}
              <span className="mr-4 sm:mr-5 md:mr-6 shrink">Buy Now</span>

              {/* Arrow circle — also flexible */}
              <span
                className="
                  absolute right-1 top-1/2 -translate-y-1/2
                  bg-white rounded-full flex items-center justify-center shadow

                  w-5 h-5
                  sm:w-6 sm:h-6
                  md:w-6 md:h-6

                  transition-transform duration-300 group-hover:-rotate-45
                  shrink-0
                "
              >
                <ArrowRight
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  stroke="#7077FE"
                />
              </span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Wrap Video Icon with Link and stop propagation so card click doesn't trigger */}
              {/* <Link
                to="/dashboard/my-library"
                onClick={(e) => e.stopPropagation()}
              >
                <Video className="w-4 h-4 text-gray-600" />
              </Link> */}
              <span className="font-semibold text-sm text-gray-800">
                {getCategoryIconLarge(product.category)}
              </span>
              <span className="font-semibold text-sm text-gray-800">
                {product.category}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-[#7077FE]" />
              <span className="text-xs md:text-sm text-gray-800">
                {product.duration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
