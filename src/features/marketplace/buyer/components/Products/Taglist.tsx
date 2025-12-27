import React from 'react';

interface TagListProps {
  tags: string[];
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
      <span className="font-open-sans text-[14px] sm:text-[16px] font-bold leading-[1.6] text-[#363842] whitespace-nowrap">
        Tags:
      </span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="inline-flex items-center bg-[#f2f2f2] rounded-full px-3 py-1.5 sm:py-1"
          >
            <span className="font-poppins text-[10px] sm:text-[11px] font-medium leading-[1.5] text-[#242424] whitespace-nowrap">
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};