//import React from 'react';

export default function RecommendationCard() {
  return (
    <div className="flex w-[265px] h-[266px] pt-[30px] pr-[10px] pb-[10px] pl-[10px] flex-col gap-[10px] items-start shrink-0 flex-nowrap bg-[#f1f3ff] rounded-[15px] relative overflow-hidden">
      <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative">
        <div className="flex flex-col gap-[-3px] items-start self-stretch shrink-0 flex-nowrap relative">
          <div className="flex pt-0 pr-[50px] pb-0 pl-[50px] gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative">
            <div className="flex w-[49px] h-[20px] pt-[8px] pr-[10px] pb-[8px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap rounded-[30px] relative">
              <span className="h-[15px] shrink-0 basis-auto font-['Poppins'] text-[10px] font-medium leading-[15px] text-[#fff] tracking-[-0.19px] relative text-left whitespace-nowrap">
                Maria
              </span>
            </div>
          </div>
          <div className="flex pt-0 pr-[10px] pb-0 pl-[10px] gap-[10px] justify-end items-start self-stretch shrink-0 flex-nowrap relative">
            <div className="flex w-[52px] h-[20px] pt-[8px] pr-[10px] pb-[8px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap rounded-[30px] relative">
              <span className="h-[15px] shrink-0 basis-auto font-['Poppins'] text-[10px] font-medium leading-[15px] text-[#fff] tracking-[-0.19px] relative text-left whitespace-nowrap">
                Sandy
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-[-20px] justify-center items-center self-stretch shrink-0 flex-nowrap relative">
          <div className="flex w-[70px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[45px] relative">
            <div className="w-[70px] h-[70px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/DXozdDT33u.png)] bg-cover bg-no-repeat rounded-[50%] relative" />
          </div>
          <div className="flex w-[70px] gap-[10px] items-center shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/a3ed393a-e10c-4df2-82d7-47d5787d5ba1.png)] bg-cover bg-no-repeat rounded-[45px] relative">
            <div className="w-[70px] h-[70px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/AiJm57xPnT.png)] bg-cover bg-no-repeat rounded-[50%] relative" />
          </div>
          <div className="flex w-[70px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[45px] relative">
            <div className="w-[70px] h-[70px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/cpRcmzqqDV.png)] bg-cover bg-no-repeat rounded-[50%] relative" />
          </div>
          <div className="flex w-[72px] h-[52px] pt-0 pr-[19px] pb-0 pl-[19px] gap-[10px] justify-end items-center shrink-0 flex-nowrap bg-[#fff] rounded-[45px] relative">
            <div className="w-[34px] h-[34px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/6mh4QZBBMA.png)] bg-cover bg-no-repeat relative overflow-hidden" />
          </div>
        </div>
      </div>
      <div className="flex pt-0 pr-[20px] pb-0 pl-[20px] flex-col gap-[3px] items-start self-stretch shrink-0 flex-nowrap relative">
        <span className="h-[24px] shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[23.6px] text-[#080f20] tracking-[-0.2px] relative text-left whitespace-nowrap">
          Top Sellers
        </span>
        <div className="flex items-center self-stretch shrink-0 flex-nowrap rounded-[30px] relative">
          <span className="flex w-[205px] h-[36px] justify-start items-start grow shrink-0 basis-0 font-['Open_Sans'] text-[12px] font-normal leading-[18px] text-[#3d3d3d] tracking-[-0.23px] relative text-left">
            Explore wisdom and creativity from our top Sellers.
          </span>
        </div>
      </div>
    </div>
  );
}
