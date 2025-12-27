import PriceDisplay from "../Products/PriceDisplay";

interface OrderPlaceProps {
  date: string;
  total: string;
  originalPrice: string;
  discount: string;
  orderId: string;
}

export default function OrderPlace({
  date,
  total,
  originalPrice,
  discount,
  orderId,
}: OrderPlaceProps) {
  return (
    <div
      className="
        w-full
        px-4 sm:px-6 lg:px-10
        py-4
        flex flex-col sm:flex-row
        gap-4 sm:gap-6
        justify-between
        rounded-t-2xl
        bg-gradient-to-t from-white to-[#F1F3FF]
        border border-[#f3f3f3]
      "
    >
      {/* LEFT SECTION */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 flex-1">

        {/* ORDER DATE */}
        <div className="flex flex-col gap-1">
          <span className="font-['Poppins'] text-sm text-[#363842]">
            Order Placed
          </span>
          <span className="font-['Poppins'] text-lg sm:text-xl font-semibold text-[#242424]">
            {date}
          </span>
        </div>

        {/* TOTAL */}
        <div className="flex flex-col gap-1">
          <span className="font-['Poppins'] text-sm text-[#363842]">
            Total
          </span>
          <PriceDisplay
            currentPrice={total}
            originalPrice={originalPrice}
            discount={discount}
            variant="inline"
          />
        </div>
      </div>

      {/* RIGHT SECTION — ORDER ID */}
      <div className="flex flex-col gap-1 sm:items-end">
        <span className="font-['Poppins'] text-sm text-[#363842]">
          Order ID
        </span>
        <span className="font-['Poppins'] text-lg sm:text-xl font-semibold text-[#242424]">
          {orderId}
        </span>
      </div>
    </div>
  );
}
