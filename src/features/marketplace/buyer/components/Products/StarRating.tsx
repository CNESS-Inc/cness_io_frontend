import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, size = 'medium' }) => {
  const starSize = size === 'small' ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]';
  
  return (
    <div className={`flex gap-[3px] items-start shrink-0 flex-nowrap relative`}>
      {Array.from({ length: maxRating }, (_, index) => (
  <div
    key={index}
    className={`
      ${starSize}
      ${index < rating ? 'opacity-100' : 'opacity-30'}
      bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/uP86JNUZci.png)]
      bg-cover bg-no-repeat
    `}
  />
))}
    </div>
  );
};
