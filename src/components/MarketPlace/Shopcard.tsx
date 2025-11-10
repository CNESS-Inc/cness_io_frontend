import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ShopCardProps {
  id: number;
  image: string;
  name: string;
  description: string;
  rating: number;
  logo: string;
}

const ShopCard: React.FC<ShopCardProps> = ({
  id,
  image,
  name,
  description,
  rating,
  logo
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/shop-detail/${id}`, { state: { id, image, name, description, rating, logo } })}
      className="         
  sm:w-full
  md:w-full
  flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex-shrink-0">
        <img
          src={image || 'https://static.codia.ai/image/2025-10-24/COYsFisEy4.png'}
          alt={name}
          className="
            w-full
            h-[100px]          // Very small screens (default)
            sm:h-[80px] w-[80px]        // Small screens
            md:h-[120px] w-[80px]       // Medium screens/tablets
            lg:h-[160px] w-[80px]      // Larger screens
            object-cover
            rounded-t-[10px]
          "
          onError={(e) => {
            e.currentTarget.src = 'https://static.codia.ai/image/2025-10-24/COYsFisEy4.png'; // fallback image
          }}
        />
      </div>

      <div className="bg-white shadow-[0px_4px_14px_rgba(0,0,0,0.1)] rounded-b-[10px] p-[12px_14px] flex flex-col gap-4 w-full h-full">
        <div className="flex flex-col gap-2 flex-grow">
          <div className="flex items-center gap-2">
            {logo ? (
              <img
                src={logo}
                alt={`${name} Logo`}
                className="w-[26px] h-[26px]"
              />
            ) : (
              <div className="w-[26px] h-[26px] flex items-center justify-center bg-gray-300 rounded-full">
                <span className="text-white font-semibold text-sm">{name.charAt(0)}</span>
              </div>
            )}
            <h3 className="font-open-sans text-[18px] leading-[24.51px] text-[#1A1A1A]">
              {name}
            </h3>
          </div>
          <p className="font-open-sans font-normal text-[10px] leading-[13.62px] text-[#A7A6A6]">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-[3px]">
          <img
            src="https://static.codia.ai/image/2025-10-24/WuhevqDEw9.png"
            alt="Star"
            className="w-[18px] h-[18px]"
          />
          <span className="font-open-sans text-[12px] text-[#1A1A1A]">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
