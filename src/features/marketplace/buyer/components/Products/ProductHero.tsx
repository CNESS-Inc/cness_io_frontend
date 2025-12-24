import React from 'react';
import { CategoryTag } from './CategoryTag';
import { StarRating } from './StarRating';
import  PriceDisplay  from './PriceDisplay';
import { ActionButtons } from './ActionButtons';
import Link from '../../../../../assets/link.svg';
import { AuthorInfo } from './AuthorInfo';
interface ProductHeroProps {
  product: {
    title: string;
    description: string;
    image: string;
    rating: number;
    reviews: number;
    originalPrice: string;
    currentPrice: string;
    discount: string;
    author: {
      name: string;
      avatar: string;
      collection?: string;
    };
    categories: { label: string; color: 'purple' | 'yellow' }[];
  };
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product }) => {
  return (
    <div className="w-full  px-0 sm:px-0 lg:px-0">
  <div className="
    relative
    flex flex-col lg:flex-row
    gap-5
    w-full
    p-4 sm:p-5
    rounded-[22px]
    border border-[#f3f3f3]
    bg-gradient-to-t from-white to-[#F1F3FF]
  ">

        {/* IMAGE */}
        <div className="relative w-full lg:w-[60%] rounded-[22px] overflow-hidden">
          <div
            className="w-full aspect-video bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image})` }}
          />

          {/* PLAY BUTTONS */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button className="w-10 h-10 flex items-center justify-center bg-[#363842] rounded-full">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/Juhp3FRVcz.png"
                className="w-5 h-5"
              />
            </button>

            <button className="w-10 h-10 flex items-center justify-center bg-[#363842] rounded-full">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/80WajkqJEV.png"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-between gap-6 lg:w-[35%] py-2 sm:py-6">

          {/* TOP */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <CategoryTag
                  key={cat.label}
                  label={cat.label}
                  color={cat.color}
                />
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium text-[#363842]">
              {product.title}
            </h1>

            <p className="text-sm sm:text-base text-[#363842] max-w-full">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-[#81859c]">
                {product.reviews}
              </span>
            </div>

            <AuthorInfo
              name={product.author.name}
              avatar={product.author.avatar}
              collection={product.author.collection}
            />
          </div>

          {/* BOTTOM */}
         <div className="flex items-end justify-between w-full gap-4">
  
  {/* LEFT: Price + Buttons */}
  <div className="flex flex-col gap-3">
    <PriceDisplay
      originalPrice={product.originalPrice}
      currentPrice={product.currentPrice}
      discount={product.discount}
    />
    <ActionButtons />
  </div>

  {/* RIGHT: Link icon */}
  <img
    src={Link}
    alt="link"
    className="w-[18px] h-[18px] cursor-pointer mb-[6px]"
  />
</div>

        </div>
        



      </div>
    </div>
  );
};