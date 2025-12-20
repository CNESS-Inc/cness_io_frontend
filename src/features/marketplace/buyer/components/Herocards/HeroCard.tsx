//import React from 'react';

export default function HeroCard() {
  return (
     <div className="w-full relative">
      <div
        className="
          w-full
          h-[266px]
          p-[10px]
          rounded-[15px]
          bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/e4bf7eaf-66e1-4fde-acd7-1afbd01faaa0.png)]
          bg-cover
          bg-no-repeat
          relative
          overflow-hidden
        "
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#464853]/70" />

        {/* Top Pills + Arrow */}
        <div className="relative flex justify-between items-start p-[10px]">
          {/* Pills */}
          <div className="flex gap-[6px]">
            <span className="px-[12px] py-[4px] bg-white rounded-[30px] text-[10px] font-medium text-[#242424]">
              Happy
            </span>
            <span className="px-[12px] py-[4px] bg-white rounded-[30px] text-[10px] font-medium text-[#242424]">
              Pleasant
            </span>
          </div>

          {/* Arrow */}
          <div className="w-[34px] h-[34px] flex items-center justify-center bg-white rounded-full">
            <div
              className="w-[10px] h-[10px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/mA2eK0JBH1.png)] bg-cover bg-no-repeat"
            />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="relative flex flex-col gap-[10px] p-[20px] mt-[10px]">
          <h1 className="text-white leading-tight">
            <span className="block text-[50px] font-semibold">
              Hi Sri!
            </span>
            <span className="block text-[30px] font-light">
              Feeling Happy?
            </span>
          </h1>

          <button className="w-fit px-[20px] py-[10px] bg-[#623fff] rounded-[10px] text-white text-[16px] font-medium">
            Yes I am!
          </button>
        </div>
      </div>
    </div>
  );
}
