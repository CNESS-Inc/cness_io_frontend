import {
  Heart,
  ShoppingCart,
  Play,
  MessageCircle,
} from "lucide-react";
import {
  Music,
  Mic,
  Book,
  Image as ImageIcon,
  GraduationCap,Star,MessageSquareMore,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/* ---------------- TYPES ---------------- */

export type ProductCategory =
  | "Music"
  | "Podcast"
  | "Ebook"
  | "Arts"
  | "Courses"
  | "Video";

interface ProductCardProps {
    id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  author: string;
  rating: number;
  reviews: number;
  image: string;
  logo:string;
}

/* ---------------- CATEGORY ICON MAP ---------------- */

const categoryIcons: Record<ProductCategory, ReactNode> = {
  Music: <Music size={12} />,
  Podcast: <Mic size={12} />,
  Ebook: <Book size={12} />,
  Arts: <ImageIcon size={12} />,
  Courses: <GraduationCap size={12} />,
  Video: <MessageCircle size={12} />,
};

/* ---------------- COMPONENT ---------------- */

export default function ProductCard(props: ProductCardProps) {

  
  const {
    id,
    title,
    price,
    originalPrice,
    discount,
    category,
    author,
    rating,
    reviews,
    image,
    logo
  } = props;

  return (

    <Link
    to={`/dashboard/new-marketplace/categories/product/${id}`}
    className="block"
  >
    <div
      className="
        w-full
        max-w-[265px] lg:w-[265px]
        rounded-[22px]
        border border-[#F3F3F3]
        bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
        overflow-hidden
        flex flex-col
        transition hover:shadow-lg
      "
    >
      {/* ===== IMAGE ===== */}
      <div
        className="
          relative
          w-full lg:w-[235px]
          aspect-[235/225.5] lg:h-[225.5px]
          rounded-[22px]
          overflow-hidden
          mx-auto
          mt-3 lg:mt-[10px]
        "
      >
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
      <div className="px-4 pt-3 lg:pt-[10px] pb-4 flex flex-col flex-1 gap-3">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#F1F3FF] text-[#6C6CF5] text-[12px] font-medium w-fit">
          {categoryIcons[category]}
          <span>{category}</span>
        </div>

        {/* Title */}
        <h3 className="font-[Poppins] text-[18px] lg:text-[18px] font-medium text-[#080F20] leading-[20px] line-clamp-2">
          {title}
        </h3>

        {/* Rating */}
       <div className="flex items-center gap-2">
  {/* Stars */}
  <div className="flex gap-1">
    {Array.from({ length: rating }).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill="#F8B814"
        stroke="none"
      />
    ))}
  </div>

  {/* Reviews icon */}
  <MessageSquareMore size={16} stroke="#81859C" />

  {/* Reviews count */}
  <span className="text-[#81859C] text-[14px] leading-none -mt-1">
    {reviews}
  </span>
</div>

        {/* Author */}
        <div className="flex items-center gap-[8px] pt-[2px]">
            <img src={logo} alt="logo" className="w-[24px] h-[24px] rounded-full object-cover"/>
            <span className="font-['open_sans'] text-[12px] font-medium text-[#222224]">
              {author}
            </span>
          </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            {originalPrice && (
              <div className="flex items-center gap-2 text-[16px] font-[poppins] font-medium">
                <span className="line-through text-[#81859C]">
                  ${originalPrice}
                </span>
                {discount && (
                  <span className="px-2 py-[2px] bg-[#EEF2FF] text-[#4F46E5] rounded text-[11px] font-medium">
                    -{discount}%
                  </span>
                )}
              </div>
            )}

            <div className="text-[30px] lg:text-[30px] font-semibold text-[#363842] font-[poppins]">
              ${price.toFixed(2)}
            </div>
          </div>

          {/* CTA AREA */}
          <div className="flex flex-col items-end gap-2">
            {(category === "Music" || category === "Podcast") && (
              <button
                className="
                  w-10 h-10 lg:w-11 lg:h-11
                  rounded-xl
                  border border-[#6C6CF5]
                  text-[#6C6CF5]
                  bg-white
                  flex items-center justify-center
                  hover:bg-[#EEF2FF]
                  transition
                "
              >
                <Play size={16} fill="#7077FE"/>
              </button>
            )}

            <button
              className="
                w-10 h-10 lg:w-11 lg:h-11
                rounded-xl
                bg-[#6C6CF5]
                font-[poppins]
                text-white
                text-sm
                font-[12px]
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
    </Link>
  );
}
