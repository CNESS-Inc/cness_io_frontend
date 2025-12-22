import React from 'react';

interface TagListProps {
  tags: string[];
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="flex gap-[10px] items-center self-stretch shrink-0 flex-nowrap relative">
      <span className="h-[26px] shrink-0 basis-auto font-['Open_Sans'] text-[16px] font-bold leading-[25.6px] text-[#363842] relative text-left whitespace-nowrap">
        Tags:
      </span>
      <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative">
        {tags.map((tag, index) => (
          <div key={index} className="flex pt-[3px] pr-[10px] pb-[3px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#f2f2f2] rounded-[30px] relative">
            <span className="h-[15px] shrink-0 basis-auto font-['Poppins'] text-[10px] font-medium leading-[15px] text-[#242424] tracking-[-0.19px] relative text-left whitespace-nowrap">
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
