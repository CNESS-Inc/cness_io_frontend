import React from 'react';
import { StarRating } from '../Products/StarRating';

interface ReviewCardProps {
  rating: number;
  comment: string;
  tags: string[];
  author: {
    name: string;
    initials: string;
    timeAgo: string;
  };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ rating, comment, tags, author }) => {
  return (
    <div className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative">
      <div className="flex gap-[16px] items-center self-stretch shrink-0 flex-nowrap relative">
        <StarRating rating={rating} size="small" />
      </div>
      
      <span className="flex w-[320px] h-[52px] justify-start items-start shrink-0 font-['Open_Sans'] text-[16px] font-normal leading-[25.6px] text-[#363842] relative text-left">
        {comment}
      </span>
      
      <div className="flex gap-[8px] items-start shrink-0 flex-nowrap relative">
        {tags.map((tag, index) => (
          <div key={index} className="flex pt-[2px] pr-[8px] pb-[2px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#f2f2f2] rounded-[60px] relative">
            <div className="flex gap-[8px] items-center shrink-0 flex-nowrap bg-[rgba(255,255,255,0.1)] rounded-[100px] relative">
              <div className="flex gap-[2px] justify-center items-center shrink-0 flex-nowrap relative">
                <span className="h-[16px] shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#242424] relative text-left whitespace-nowrap">
                  {tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative">
        <div className="w-[24px] h-[24px] shrink-0 relative">
          <div className="w-full h-full bg-[rgba(255,149,0,0.24)] rounded-[99px] absolute top-0 left-0" />
          <span className="flex w-[24px] justify-center items-center font-['Poppins'] text-[10px] font-semibold leading-[13.5px] text-[#ff9500] tracking-[0.1px] absolute top-0 bottom-0 left-0 right-0 text-center">
            {author.initials}
          </span>
        </div>
        <div className="flex justify-between items-center self-stretch grow shrink-0 basis-0 flex-nowrap relative">
          <span className="h-[14px] shrink-0 basis-auto font-['Poppins'] text-[12px] font-semibold leading-[14px] text-[#1c1c1e] tracking-[-0.36px] relative text-left whitespace-nowrap">
            {author.name}
          </span>
          <span className="h-[16px] shrink-0 basis-auto font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#aeaeb2] tracking-[0.36px] relative text-left whitespace-nowrap">
            {author.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};
