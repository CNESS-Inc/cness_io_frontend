import React from 'react';

interface PriceDisplayProps {
  originalPrice: string;
  currentPrice: string;
  discount: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  currentPrice,
  discount,
}) => {  return (
    <div className="flex flex-col gap-[10px] justify-center items-start grow shrink-0 basis-0 flex-nowrap relative">
      <div className="flex flex-col gap-[3px] items-start shrink-0 flex-nowrap relative">
        <div className="flex gap-[14px] justify-end items-center shrink-0 flex-nowrap relative">
          <span className="h-[19px] shrink-0 basis-auto font-['Poppins'] text-[16px] font-medium leading-[19px] text-[#81859c] relative text-left whitespace-nowrap">
            {originalPrice}
          </span>
          <div className="flex pt-[3px] pr-[9px] pb-[3px] pl-[9px] gap-[17px] justify-center items-center shrink-0 flex-nowrap bg-[#e9f0ff] rounded-[3px] relative">
            <span className="h-[12px] shrink-0 basis-auto font-['Inter'] text-[10px] font-medium leading-[12px] text-[#102b6b] relative text-left whitespace-nowrap">
              {discount}
            </span>
          </div>
        </div>
        <span className="h-[36px] shrink-0 basis-auto font-['Poppins'] text-[30px] font-semibold leading-[36px] text-[#363842] relative text-left whitespace-nowrap">
          {currentPrice}
        </span>
      </div>
    </div>
  );
};
export default PriceDisplay;