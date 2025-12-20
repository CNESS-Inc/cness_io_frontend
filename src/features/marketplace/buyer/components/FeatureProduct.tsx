import { Heart, ShoppingCart } from "lucide-react";
import { Music, Book, Film, Mic } from "lucide-react";
import type { ReactNode } from "react";



const categoryIcons: Record<string, ReactNode> = {
  Music: <Music size={12} />,
  Ebook: <Book size={12} />,
  Video: <Film size={12} />,
  Podcast: <Mic size={12} />,
};

export default function FeatureProduct({
  title,
  description,
  price,
  originalPrice,
  discount,
  category,
  categoryColor,
  author,
  image,
  logo,
}: any) {
  return (
    <div
      className="
        w-full
        flex flex-col sm:flex-row
        gap-[16px]
        p-[15px]
        rounded-[22px]
        border border-[#F3F3F3]
        bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
        transition-all
      "
    >
      {/* ===== IMAGE ===== */}
      <div
        className="
          relative
          w-full
          sm:max-w-[260px]
          lg:max-w-[341px]
          aspect-[341/327]
          rounded-[18px]
          overflow-hidden
          flex-shrink-0
        "
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Overlay buttons */}
        <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px]">
          <button className="w-[36px] h-[36px] rounded-full bg-black/70 flex items-center justify-center text-white">
            <Heart size={16} />
          </button>
          <button className="w-[36px] h-[36px] rounded-full bg-black/70 flex items-center justify-center text-white">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-[6px]">
        <div className="space-y-[8px]">
         <span
  className={`inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full text-[12px] font-medium ${categoryColor}`}
>
  {categoryIcons[category]}
  <span>{category}</span>
</span>

          <h3 className="font-[Poppins] text-[18px] sm:text-[18px] font-medium text-[#363842] leading-[24px]">
            {title}
          </h3>

          <p className="font-['open_sans'] text-[12px] leading-[18px] text-[#363842] line-clamp-3">
            {description}
          </p>

          <div className="flex items-center gap-[8px] pt-[6px]">
            <img src={logo} alt="logo" className="w-[24px] h-[24px] rounded-full object-cover"/>
            <span className="font-['open_sans'] text-[12px] font-medium text-[#222224]">
              {author}
            </span>
          </div>
        </div>

        {/* PRICE */}
        <div className="pt-[10px]">
          {originalPrice && (
            <div className="flex items-center gap-[8px] text-[13px]">
              <span className="line-through text-[#9CA3AF]">
                ${originalPrice.toFixed(2)}
              </span>
              {discount && (
                <span className="px-[8px] py-[2px] rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-medium">
                  -{discount}%
                </span>
              )}
            </div>
          )}

          <div className="font-[Poppins] text-[30px] sm:text-[30px] font-semibold text-[#363842]">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
