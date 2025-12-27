import React from 'react';
import { ReviewCard } from '../Products/ReviewCard';

const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      rating: 5,
      comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
      tags: ["Inner Awakening", "Cosmic Union", "Impactful"],
      author: {
        name: "Gregory Howard",
        initials: "GH",
        timeAgo: "1day ago"
      }
    },
    {
      rating: 5,
      comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
      tags: ["Inner Awakening", "Cosmic Union"],
      author: {
        name: "Gregory Howard",
        initials: "GH",
        timeAgo: "1day ago"
      }
    },
    {
      rating: 5,
      comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
      tags: ["Inner Awakening", "Cosmic Union"],
      author: {
        name: "Gregory Howard",
        initials: "GH",
        timeAgo: "1day ago"
      }
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col bg-[#f9f9f9] rounded-[21px] border border-[#cbd5e1] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 md:px-5 md:py-5">
          <h2 className="font-['Poppins'] text-lg md:text-xl font-semibold text-[#1c1c1e] tracking-[-0.6px]">
            Customer Reviews (5)
          </h2>
        </div>
        
        <div className="px-4 py-5 md:px-6 md:py-6 flex flex-col gap-6 md:gap-8">
          {/* Rating Overview */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-Metropolis text-3xl md:text-4xl font-semibold text-[#222222] tracking-[-0.41px]">
                  4.3
                </span>
                <span className="font-Metropolis text-sm text-[#9b9b9b] mt-2">
                  23 ratings
                </span>
              </div>
              
              {/* Optional: Add star rating visualization here if needed */}
            </div>
            
            {/* Write Review Button */}
            <div className="flex flex-col gap-4">
              <span className="font-['Poppins'] text-sm md:text-base font-semibold text-[#1c1c1e] tracking-[-0.42px]">
                Do you own this product?
              </span>
              <button className="flex items-center justify-center gap-3 bg-[#7076fe] text-white rounded-[10px] py-3 px-4 md:py-4 md:px-5 hover:bg-[#5a60e0] transition-colors">
                <span className="font-['Poppins'] text-sm md:text-base font-semibold tracking-[0.28px]">
                  Write a Review
                </span>
                <div className="w-4 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/HTUHmnQZYV.png)] bg-cover bg-no-repeat" />
              </button>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px w-full bg-gray-300" />
          
          {/* Reviews List */}
          <div className="flex flex-col gap-6 md:gap-8">
            {reviews.map((review, index) => (
              <React.Fragment key={index}>
                <ReviewCard {...review} />
                {index < reviews.length - 1 && (
                  <div className="h-px w-full bg-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Bottom Divider and Show More */}
          <div className="flex flex-col items-center">
            <div className="h-px w-full bg-gray-300 mb-6" />
            <button className="font-['Poppins'] text-sm text-[#007aff] tracking-[0.36px] hover:text-[#0056b3] transition-colors">
              Show 2 more comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;