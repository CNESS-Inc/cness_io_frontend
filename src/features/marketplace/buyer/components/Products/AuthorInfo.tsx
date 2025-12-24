import React from 'react';

interface AuthorInfoProps {
  name: string;
  avatar: string;
  collection?: string;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ name, avatar, collection }) => {
  return (
    <div className="flex gap-[8px] items-center shrink-0 flex-nowrap relative">
      <div className="flex w-[22px] h-[24px] pt-[1px] pr-0 pb-[1px] pl-0 gap-[4px] items-start shrink-0 flex-nowrap relative">
        <div className={`flex w-[22px] h-[22px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col gap-[8px] items-start shrink-0 flex-nowrap  bg-cover bg-no-repeat rounded-[11px] relative overflow-hidden`}style={{ backgroundImage: `url(${avatar})` }} />
      </div>
      <div className="flex w-[50px] flex-col gap-[4px] justify-center items-start shrink-0 flex-nowrap relative">
        <span className="h-[16px] shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-semibold leading-[16px] text-[#222224] relative text-left whitespace-nowrap">
          {name}
        </span>
      </div>
      {collection && (
        <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative">
          <div className="w-[15px] h-[15px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/uPsgy6T8hf.png)] bg-cover bg-no-repeat relative overflow-hidden" />
          <span className="flex h-[14px] justify-center items-start shrink-0 basis-auto font-['Poppins'] text-[12px] font-medium leading-[14px] text-[#7076fe] relative text-center underline whitespace-nowrap">
            {collection}
          </span>
        </div>
      )}
    </div>
  );
};
