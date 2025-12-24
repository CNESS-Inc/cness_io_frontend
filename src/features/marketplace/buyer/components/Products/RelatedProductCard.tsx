import React from 'react';
import { AuthorInfo } from '../Products/AuthorInfo';

interface RelatedProductCardProps {
  image: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ 
  image, 
  title, 
  description, 
  author 
}) => {
  return (
    <div className="flex w-[170px] h-[289px] pt-[15px] pr-[15px] pb-[15px] pl-[15px] flex-col gap-[10px] items-center shrink-0 flex-nowrap rounded-[22px] border-solid border border-[#f3f3f3] relative overflow-hidden">
      <div className="flex h-[134px] flex-col gap-[10px] items-center self-stretch shrink-0 flex-nowrap rounded-[22px] relative overflow-hidden">
<div
  className="w-[201px] h-[134px] bg-cover bg-center"
  style={{ backgroundImage: `url(${image})` }}
/>      </div>
      
      <div className="flex justify-between items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
        <div className="flex flex-col gap-[30px] items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
          <div className="flex flex-col gap-[5px] items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
            <div className="flex w-[94px] gap-[12px] items-center shrink-0 flex-nowrap bg-[rgba(255,255,255,0.1)] rounded-[100px] relative">
              <div className="flex w-[60px] gap-[12px] justify-center items-center shrink-0 flex-nowrap relative">
                <span className="flex w-[36px] justify-start items-start self-stretch shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#ef7dff] relative text-left whitespace-nowrap">
                  Music
                </span>
                <div className="w-[12px] h-[12px] shrink-0 relative overflow-hidden">
                  <div className="w-[8px] h-[8px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/CbgLxBg0gm.png)] bg-[length:100%_100%] bg-no-repeat relative mt-[2px] mr-0 mb-0 ml-[2px]" />
                </div>
              </div>
            </div>
            
            <span className="h-[16px] self-stretch shrink-0 basis-auto font-['Poppins'] text-[13px] font-medium leading-[15.6px] text-[#363842] relative text-left overflow-hidden whitespace-nowrap">
              {title}
            </span>
            
            <span className="flex w-[140px] h-[49px] justify-start items-start self-stretch shrink-0 font-['Open_Sans'] text-[10px] font-normal leading-[16px] text-[#363842] relative text-left overflow-hidden">
              {description}
            </span>
            
            <AuthorInfo name={author.name} avatar={author.avatar} />
          </div>
        </div>
      </div>
    </div>
  );
};
