import React from 'react';

export const ActionButtons: React.FC = () => {
  return (
    <div className="flex w-[194px] pt-[5px] pr-0 pb-[5px] pl-0 gap-[4px] justify-end items-end shrink-0 flex-nowrap relative">
      <div className="flex w-[50px] gap-[10px] items-center shrink-0 flex-nowrap relative">
        <div className="flex w-[50px] h-[50px] flex-col justify-center items-center shrink-0 flex-nowrap bg-[#7076fe] rounded-[10px] relative">
          <span className="h-[14px] self-stretch shrink-0 basis-auto font-['Poppins'] text-[12px] font-medium leading-[14px] text-[#fff] relative text-center whitespace-nowrap">
            Buy
          </span>
        </div>
      </div>
      
      <div className="flex w-[50px] gap-[10px] items-center shrink-0 flex-nowrap relative">
        <div className="flex w-[50px] h-[50px] flex-col justify-center items-center shrink-0 flex-nowrap rounded-[10px] border-solid border border-[#7076fe] relative">
          <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/mmTSvx8vjx.png)] bg-cover bg-no-repeat relative overflow-hidden" />
        </div>
      </div>
      
      <div className="flex w-[86px] pt-[6px] pr-0 pb-[6px] pl-0 gap-[10px] justify-center items-end self-stretch shrink-0 flex-nowrap relative">
        <span className="flex w-[86px] h-[14px] justify-center items-start shrink-0 basis-auto font-['Poppins'] text-[12px] font-medium leading-[14px] text-[#7076fe] relative text-center underline whitespace-nowrap">
          Ask your price
        </span>
      </div>
    </div>
  );
};
