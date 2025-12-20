import { Heart, ShoppingCart, Play, MessageCircle } from "lucide-react";
import { Music, Mic, Book, Image, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

/* ---------------- TYPES ---------------- */

export type ProductCategory =
  | "Music"
  | "Podcast"
  | "Ebook"
  | "Arts"
  | "Courses"
  | "Video";

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  author: string;
  rating: number;
  reviews: number;
  image: string;
}
/* ---------------- CATEGORY ICON MAP ---------------- */

const categoryIcons: Record<ProductCategory, ReactNode> = {
  Music: <Music size={12} />,
  Podcast: <Mic size={12} />,
  Ebook: <Book size={12} />,
  Arts: <Image size={12} />,
  Courses: <GraduationCap size={12} />,
  Video: <MessageCircle size={12} />,
};

/* ---------------- COMPONENT ---------------- */

export default function ProductCard({
  title,
  price,
  originalPrice,
  discount,
  category,
  author,
  rating,
  reviews,
  image,
}: ProductCardProps) {

  return (
    <div
      className="
        w-full max-w-[265px]
        rounded-[22px]
        border border-[#F3F3F3]
        bg-gradient-to-b from-[#FFFFFF] to-[#F1F3FF]
        overflow-hidden
        flex flex-col
        transition hover:shadow-lg
      "
    >
      {/* ===== IMAGE ===== */}
      <div className="relative aspect-[1/1.15] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Overlay buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center">
            <Heart size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#F1F3FF] text-[#6C6CF5] text-[12px] font-medium w-fit">
          {categoryIcons[category]}
          <span>{category}</span>
        </div>

        {/* Title */}
        <h3 className="font-[Poppins] text-[15px] font-medium text-[#080F20] leading-[20px] line-clamp-2">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 text-[12px]">
          <div className="flex gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
          </div>
          <span className="text-[#6B7280]">{reviews}</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-[13px]">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <span className="text-[#080F20]">{author}</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {originalPrice && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="line-through text-[#9CA3AF]">
                  ${originalPrice}
                </span>
                {discount && (
                  <span className="px-2 py-[2px] bg-[#EEF2FF] text-[#4F46E5] rounded text-[11px] font-medium">
                    -{discount}%
                  </span>
                )}
              </div>
            )}

            <div className="text-[22px] font-semibold text-[#080F20]">
              ${price.toFixed(2)}
            </div>
          </div>

          {/* CTA AREA */}
<div className="flex flex-col items-end gap-2">
  {/* Play button (only for Music / Podcast) */}
  {(category === "Music" || category === "Podcast") && (
    <button
      className="
        w-11 h-11
        rounded-xl
        border border-[#6C6CF5]
        text-[#6C6CF5]
        bg-white
        flex items-center justify-center
        hover:bg-[#EEF2FF]
        transition
      "
    >
      <Play size={16} />
    </button>
  )}

  {/* Buy Now (for ALL products) */}
  <button
    className="
       w-11 h-11
      rounded-xl
      bg-[#6C6CF5]
      text-white
      text-sm
      font-medium
      hover:bg-[#5B5BEA]
      transition
    "
  >
    Buy
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
