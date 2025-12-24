import { X } from "lucide-react";
import { CategoryTag } from "../components/Products/CategoryTag";
import { AuthorInfo } from "../components/Products/AuthorInfo";
import PriceDisplay from "../components/Products/PriceDisplay";


interface CartItemCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  price: string;
  originalPrice: string;
  discount: string;
  onRemove?: () => void;
}

export default function CartItemCard({
  title,
  description,
  category,
  image,
  author,
  price,
  originalPrice,
  discount,
  onRemove,
}: CartItemCardProps) {
  return (
    <div
      className="
        relative
        flex flex-col sm:flex-row
        gap-[16px] sm:gap-[30px]
        p-[10px]
        rounded-[22px]
        border border-[#ECECFE]
        bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
        w-full
        min-h-[154px]
      "
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="
          w-full sm:w-[110px]
          h-[160px] sm:h-[110px]
          rounded-[18px]
          object-cover
          shrink-0
        "
      />

      {/* Content */}
      <div className="flex flex-col gap-[6px] flex-1 min-w-0">
        
        {/* Category */}
        <div className="flex items-center sm:-ml-2">
          <CategoryTag label={category} color="purple" />
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-semibold text-[#363842] leading-[20px] truncate">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#6b7280] leading-[18px] line-clamp-2">
          {description}
        </p>

        {/* Author */}
        <AuthorInfo
          name={author.name}
          avatar={author.avatar}
        />
      </div>

      {/* Right section */}
      <div
        className="
          flex flex-row sm:flex-col
          justify-between sm:items-end
          items-center
          gap-4
          sm:gap-0
        "
      >
        {/* Remove */}
        <button
          onClick={onRemove}
          className="w-[28px] h-[28px] rounded-[8px] bg-[#F2F2F2] flex items-center justify-center shrink-0"
        >
          <X size={14} />
        </button>

        {/* Price */}
        <PriceDisplay
          currentPrice={price}
          originalPrice={originalPrice}
          discount={discount}
          variant="inline"
        />
      </div>
    </div>
  );
}