import React from "react";
import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  id: number;
  image: string;
  name: string;
  description: string;
  rating: number;
  logo: string;
}

const fallbackCover = "https://static.codia.ai/image/2025-10-24/COYsFisEy4.png";
const starIcon = "https://static.codia.ai/image/2025-10-24/WuhevqDEw9.png";

const ShopCard: React.FC<ShopCardProps> = ({
  id,
  image,
  name,
  description,
  rating,
  logo,
}) => {
  const navigate = useNavigate();

  const goToShop = () =>
    navigate(`/dashboard/shop-detail/${id}`, {
      state: { id, image, name, description, rating, logo },
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToShop();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={goToShop}
      className="
        bg-white rounded-xl overflow-hidden
        shadow-[0_6px_20px_rgba(8,15,30,0.06)]
        hover:shadow-[0_8px_28px_rgba(8,15,30,0.08)]
        hover:-translate-y-1 transform transition-all duration-300
        cursor-pointer w-full
        "
      aria-label={`Open shop ${name}`}
    >
      {/* Cover image — keep aspect ratio, responsive height */}
      <div className="w-full">
        <img
          src={image || fallbackCover}
          loading="lazy"
          alt={name || "Shop cover"}
          className="w-full aspect-[16/9] object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackCover;
          }}
        />
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {/* logo / avatar */}
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">
                {name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3
              className="text-[16px] md:text-[17px] font-semibold text-[#111827] truncate"
              title={name}
            >
              {name}
            </h3>

            <p
              className="text-[13px] text-[#6B7280] mt-1 line-clamp-2"
              title={description}
            >
              
            </p>
          </div>
        </div>

        {/* footer row: rating aligned right */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={starIcon} alt="rating" className="w-4 h-4" />
            <span className="text-sm font-medium text-[#111827]">
              {rating && rating > 0 ? rating.toFixed(1) : "0.0"}
            </span>
          </div>

          {/* optional: small badge or actions area */}
          {/* <div>…</div> */}
        </div>
      </div>
    </article>
  );
};

export default ShopCard;
