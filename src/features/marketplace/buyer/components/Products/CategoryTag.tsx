import React from 'react';

interface CategoryTagProps {
  label: string;
  color: string;
  className?: string;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ label, color, className = "" }) => {


  return (
    <div className={`flex pt-0 pr-[10px] pb-0 pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap ${color}  rounded-[20px] relative ${className}`}>
      <div className="flex gap-[8px] items-center shrink-0 flex-nowrap bg-[rgba(255,255,255,0.1)] rounded-[100px] relative">
        <div className="flex gap-[2px] justify-center items-center shrink-0 flex-nowrap relative">
          <span className="flex justify-start items-start shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-normal leading-[16px] relative text-left whitespace-nowrap">
            {label}
          </span>
          <div className="w-[12px] h-[12px] shrink-0 relative overflow-hidden">
            <div className="w-[8px] h-[8px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/rP4FXCs5NS.png)] bg-[length:100%_100%] bg-no-repeat relative mt-[2px] mr-0 mb-0 ml-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
