import { useState } from "react";

interface StarRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  allowHalfStars?: boolean;
}

export const StarRating = ({
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  size = "md",
  allowHalfStars = false,
}: StarRatingProps) => {

  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [_hoverPosition, setHoverPosition] = useState<number | null>(null);

  const sizeClasses = {
    xs: "text-xs",    // 12px
    sm: "text-sm",    // 14px
    md: "text-base",  // 16px
    lg: "text-lg",    // 18px
    xl: "text-xl",    // 20px
    "2xl": "text-2xl", // 24px
    "3xl": "text-3xl", // 24px
    "4xl": "text-4xl", // 24px
  };

  const handleClick = (star: number, position: number) => {
    if (readOnly) return;
    
    let newRating = star;
    if (allowHalfStars && position < 0.5) {
      newRating = star - 0.5;
    }
    
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseMove = (star: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setHoverPosition(pos);
    
    if (allowHalfStars) {
      setHover(pos < 0.5 ? star - 0.5 : star);
    } else {
      setHover(star);
    }
  };

  const renderStar = (star: number) => {
    const currentValue = hover || rating;
    const isFilled = star <= currentValue;
    const isHalfFilled = allowHalfStars && (star - 0.5 <= currentValue) && (currentValue < star);

    if (isHalfFilled) {
      return (
        <span className="relative">
          <span className="text-gray-300">★</span>
          <span 
            className="absolute left-0 top-0 w-1/2 overflow-hidden"
            style={{ color: hover ? '#FFD700' : '#FFD700' }}
          >
            ★
          </span>
        </span>
      );
    }

    return (
      <span style={{ color: isFilled ? '#FFD700' : '#D1D5DB' }}>
        ★
      </span>
    );
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} ${
            readOnly ? "cursor-default" : "cursor-pointer"
          } relative`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            handleClick(star, pos);
          }}
          onMouseMove={(e) => handleMouseMove(star, e)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => {
            if (!readOnly) {
              setHover(0);
              setHoverPosition(null);
            }
          }}
          disabled={readOnly}
        >
          {renderStar(star)}
        </button>
      ))}
    </div>
  );
};