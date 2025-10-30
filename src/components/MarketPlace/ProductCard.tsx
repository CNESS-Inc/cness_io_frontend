import React, { useState } from "react";
import { ShoppingCart, Star, ArrowRight, Heart, Video, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  mood?: string;
}

interface ProductCardProps {
  product: Product;
  isLiked?: boolean; // ✅ new prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/product-detail/${product.id}`, { state: { product } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-300 rounded-[14px] overflow-hidden w-full h-full cursor-pointer 
                 transition-transform duration-300 hover:shadow-lg flex flex-col"
    >
      {/* Product Image */}
      <div className="relative group w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* ❤️ Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 z-30 flex items-center justify-center transition-transform duration-300 hover:scale-110 rounded-full p-1"
        >
          <Heart
            className={`w-7 h-7 transition-colors duration-300 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-300 fill-gray-300"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="bg-purple-50 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
            {product.mood}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-[#7077FE] fill-[#7077FE]" />
            <span className="text-xs font-semibold text-gray-800">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm md:text-base text-gray-800 leading-tight mb-1 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">{product.author}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                ${product.currentPrice}
              </span>
              {product.discount && (
                <span className="text-xs text-blue-500">({product.discount}%)</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 border border-[#7077FE] rounded-full flex items-center justify-center hover:bg-blue-50 transform transition-transform duration-300 hover:scale-110"
            >
              <ShoppingCart className="w-4 h-4 text-[#7077FE]" />
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#7077FE] text-white pl-4 pr-12 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors flex items-center overflow-hidden group"
            >
              <span>Buy Now</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight className="w-4 h-4" stroke="#7077FE" />
              </span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-sm text-gray-800">{product.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-[#7077FE]" />
              <span className="text-xs md:text-sm text-gray-800">{product.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
