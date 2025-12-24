import React from 'react';

interface PriceDisplayProps {
  originalPrice: string;
  currentPrice: string;
  discount: string;
  variant?: 'stacked' | 'inline';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  currentPrice,
  discount,
  variant = 'stacked',
}) => {

  /* ========= INLINE VARIANT ========= */
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-[8px]">
        <span className="font-['Poppins'] text-[20px] font-semibold text-[#363842] whitespace-nowrap">
          {currentPrice}
        </span>

        <span className="font-['Poppins'] text-[16px] text-[#81859c] line-through whitespace-nowrap">
          {originalPrice}
        </span>

        <span className="font-['Inter'] text-[10px] font-medium text-[#102b6b] bg-[#e9f0ff] px-[6px] py-[2px] rounded-[3px] whitespace-nowrap">
          {discount}
        </span>
      </div>
    );
  }

  /* ========= STACKED VARIANT (DEFAULT) ========= */
  return (
    <div className="flex flex-col gap-[10px] justify-center items-start">
      <div className="flex flex-col gap-[3px] items-start">
        <div className="flex gap-[14px] items-center">
          <span className="font-['Poppins'] text-[16px] font-medium text-[#81859c] whitespace-nowrap">
            {originalPrice}
          </span>

          <div className="flex px-[9px] py-[3px] bg-[#e9f0ff] rounded-[3px]">
            <span className="font-['Inter'] text-[10px] font-medium text-[#102b6b] whitespace-nowrap">
              {discount}
            </span>
          </div>
        </div>

        <span className="font-['Poppins'] text-[30px] font-semibold leading-[36px] text-[#363842] whitespace-nowrap">
          {currentPrice}
        </span>
      </div>
    </div>
  );
};

export default PriceDisplay;
