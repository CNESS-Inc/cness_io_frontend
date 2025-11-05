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
      className="w-full flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-[120px] object-cover"
      />

      <div className="bg-white shadow-[0px_4px_14px_rgba(0,0,0,0.1)] rounded-b-[10px] p-[12px_14px] flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt={`${name} Logo`}
              className="w-[26px] h-[26px]"
            />
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
