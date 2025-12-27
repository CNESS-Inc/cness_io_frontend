import { CategoryTag } from "../Products/CategoryTag";
import { AuthorInfo } from "../Products/AuthorInfo";
import { useState } from "react";
import OrderDetailsModal from "./OrderDetailmodel";

interface ProductData {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface ProductInfoProps {
  product: ProductData;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [openOrderDetails, setOpenOrderDetails] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">

      {/* IMAGE */}
      <div className="w-28 h-28 sm:w-[140px] sm:h-[134px] shrink-0 rounded-2xl overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">

        {/* TEXT */}
        <div className="flex flex-col gap-2">

  {/* CATEGORY TAG – ALWAYS ON TOP */}
  <div className="flex">
    <CategoryTag
      label={product.category}
      color={product.categoryColor}
    />
  </div>

  {/* TITLE */}
  <h3 className="font-['Poppins'] text-base sm:text-lg font-medium text-[#363842]">
    {product.title}
  </h3>

  {/* DESCRIPTION */}
  <p className="font-['Open_Sans'] text-sm text-[#363842] line-clamp-2">
    {product.description}
  </p>

</div>

        {/* AUTHOR + ACTIONS */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

  {/* AUTHOR */}
  <AuthorInfo
    name={product.author.name}
    avatar={product.author.avatar}
  />

  {/* ACTION BUTTONS */}
  <div
    className="
      grid grid-cols-2 gap-2
      sm:flex sm:flex-wrap sm:justify-end sm:gap-3
    "
  >
    {/* Primary */}
    <button
      className="
        col-span-2 sm:col-span-auto
        px-4 py-2
        rounded-md
        bg-[#7076fe]
        text-white
        text-xs sm:text-sm
        font-medium
        transition
      "
    >
      View in Library
    </button>

    {/* Secondary */}
    <button
      onClick={() => setOpenOrderDetails(true)}
      className="
        px-3 py-2
        rounded-md
        border border-[#7076fe]
        text-[#7076fe]
        text-xs sm:text-sm
        font-medium
      "
    >
      Order Details
    </button>

    <button
      className="
        px-3 py-2
        rounded-md
        border border-[#7076fe]
        text-[#7076fe]
        text-xs sm:text-sm
        font-medium
      "
    >
      Write a Review
    </button>
  </div>
</div>
      </div>

      {openOrderDetails && (
        <OrderDetailsModal onClose={() => setOpenOrderDetails(false)} />
      )}
    </div>
  );
}
