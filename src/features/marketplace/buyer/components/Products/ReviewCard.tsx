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
    <div className="flex flex-col gap-[8px] items-start w-full">
      <div className="flex gap-[16px] items-center w-full">
        <StarRating rating={rating} size="small" />
      </div>
      
      <div className="w-full">
        <span className="block w-full font-['Open_Sans'] text-[16px] font-normal leading-[25.6px] text-[#363842] text-left break-words">
          {comment}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-[8px] items-start w-full">
        {tags.map((tag, index) => (
          <div key={index} className="flex pt-[2px] pr-[8px] pb-[2px] pl-[8px] gap-[10px] justify-center items-center flex-shrink-0 bg-[#f2f2f2] rounded-[60px]">
            <div className="flex gap-[8px] items-center flex-shrink-0 bg-[rgba(255,255,255,0.1)] rounded-[100px]">
              <div className="flex gap-[2px] justify-center items-center flex-shrink-0">
                <span className="h-[16px] font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#242424] text-left whitespace-nowrap">
                  {tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-[8px] items-center w-full">
        <div className="w-[24px] h-[24px] flex-shrink-0 relative">
          <div className="w-full h-full bg-[rgba(255,149,0,0.24)] rounded-[99px] absolute top-0 left-0" />
          <span className="flex w-[24px] justify-center items-center font-['Poppins'] text-[10px] font-semibold leading-[13.5px] text-[#ff9500] tracking-[0.1px] absolute top-0 bottom-0 left-0 right-0 text-center">
            {author.initials}
          </span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="font-['Poppins'] text-[12px] font-semibold leading-[14px] text-[#1c1c1e] tracking-[-0.36px] text-left whitespace-nowrap truncate max-w-[50%]">
            {author.name}
          </span>
          <span className="font-['Open_Sans'] text-[12px] font-normal leading-[16px] text-[#aeaeb2] tracking-[0.36px] text-left whitespace-nowrap">
            {author.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};