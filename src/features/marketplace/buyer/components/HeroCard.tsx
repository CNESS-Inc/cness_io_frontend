//import React from 'react';

export default function HeroCard() {
  return (
    <div className="flex w-[550px] gap-[20px] items-center shrink-0 flex-nowrap relative">
      <div className="flex w-[550px] h-[266px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] flex-col items-start shrink-0 flex-nowrap  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/e4bf7eaf-66e1-4fde-acd7-1afbd01faaa0.png)] bg-cover bg-no-repeat rounded-[15px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#464853]/70" />

        <div className="flex pt-[10px] pr-[10px] pb-[10px] pl-[10px] justify-between items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden">
          <div className="flex w-[120px] gap-[4px] items-center shrink-0 flex-nowrap relative">
            <div className="flex w-[53px] pt-[3px] pr-[10px] pb-[3px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[30px] relative">
              <span className="h-[15px] shrink-0 basis-auto font-['Poppins'] text-[10px] font-medium leading-[15px] text-[#242424] tracking-[-0.19px] relative text-left whitespace-nowrap">
                Happy
              </span>
            </div>
            <div className="flex w-[63px] pt-[3px] pr-[10px] pb-[3px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[30px] relative">
              <span className="h-[15px] shrink-0 basis-auto font-['Poppins'] text-[10px] font-medium leading-[15px] text-[#242424] tracking-[-0.19px] relative text-left whitespace-nowrap">
                Pleasant
              </span>
            </div>
          </div>
          <div className="flex w-[34.142px] h-[34.142px] pt-[5px] pr-[10px] pb-[5px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[30px] relative">
            <div className="w-[9.899px] h-[9.899px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/mA2eK0JBH1.png)] bg-cover bg-no-repeat relative" />
          </div>
        </div>
        <div className="flex pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[4px] items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden">
          <div className="flex w-[243px] flex-col gap-[4px] justify-center items-start shrink-0 flex-nowrap relative">
            <div className="flex w-[243px] pt-[5px] pr-[10px] pb-[5px] pl-[10px] flex-col gap-[10px] justify-center items-start shrink-0 flex-nowrap rounded-[30px] relative">
              <div className="w-[223px] shrink-0 font-['Poppins'] text-[30px] font-semibold leading-[35.4px] tracking-[-0.3px] relative text-left whitespace-nowrap">
                <span className="font-['Poppins'] text-[50px] font-semibold leading-[60px] text-[#fff] tracking-[-0.3px] relative text-left">
                  Hi Sri! <br />
                </span>
                <span className="font-['Poppins'] text-[30px] font-light leading-[35.4px] text-[#fff] tracking-[-0.3px] relative text-left">
                  Feeling Happy?
                </span>
              </div>
              <div className="flex w-[120px] h-[44px] pt-[5px] pr-[10px] pb-[5px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#623fff] rounded-[10px] relative">
                <span className="flex w-[71px] h-[24px] justify-start items-start shrink-0 basis-auto font-['Poppins'] text-[16px] font-medium leading-[24px] text-[#fff] tracking-[-0.3px] relative text-left whitespace-nowrap">
                  Yes I am!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
