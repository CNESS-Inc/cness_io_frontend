//import React from 'react';

export default function Recommendedcard1() {
  return (
   <div className="flex w-[265px] flex-col gap-[20px] justify-center items-start self-stretch shrink-0 flex-nowrap rounded-[15px] border-solid border border-[#ecebeb] relative box-content overflow-hidden">
        <div className="flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] flex-col gap-[10px] items-center self-stretch grow shrink-0 basis-0 flex-nowrap bg-[rgba(9,9,9,0.2)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/e56dc016-8e05-4d16-b401-e4ff7861191c.png)] bg-cover bg-no-repeat relative overflow-hidden">
          <div className="flex flex-col justify-between items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
            <div className="flex w-[219px] flex-col gap-[5px] items-start shrink-0 flex-nowrap relative">
              <div className="flex w-[156px] pt-[3px] pr-[10px] pb-[3px] pl-[10px] gap-[12px] items-center shrink-0 flex-nowrap bg-[rgba(255,255,255,0.22)] rounded-[100px] relative">
                <div className="flex w-[136px] justify-center items-center shrink-0 flex-nowrap relative">
                  <span className="h-[16px] shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#fff] relative text-left whitespace-nowrap">
                    Recommndation for you
                  </span>
                </div>
              </div>
              <span className="flex w-[219px] h-[92px] justify-start items-start shrink-0 font-['Poppins'] text-[38px] font-semibold leading-[45.6px] text-[#fff] relative text-left overflow-hidden">
                Dance of <br />
                Siddhars
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
