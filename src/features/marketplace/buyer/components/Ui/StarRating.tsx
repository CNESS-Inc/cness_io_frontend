import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export default function StarRating({ 
  rating, 
  size = 16, 
//   showNumber = true 
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`full-${i}`} 
          size={size} 
          fill="#FFB800" 
          color="#FFB800" 
          className="flex-shrink-0"
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative flex-shrink-0">
          <Star size={size} fill="#E5E5E5" color="#E5E5E5" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={size} fill="#FFB800" color="#FFB800" />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          size={size} 
          fill="#E5E5E5" 
          color="#E5E5E5" 
          className="flex-shrink-0"
        />
      ))}
      
      {/* Rating number */}
      {/* {showNumber && (
        <span className="ml-1 text-[14px] font-medium text-[#363842]">
          {rating.toFixed(1)}
        </span>
      )} */}
    </div>
  );
}