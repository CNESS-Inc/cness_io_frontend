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
    <div className="flex w-[360px] gap-[10px] justify-center items-center shrink-0 flex-nowrap rounded-[21px] border-solid border border-[#cbd5e1] relative overflow-hidden">
      <div className="flex w-[360px] flex-col items-center shrink-0 flex-nowrap bg-[#f9f9f9] rounded-[8px] relative overflow-hidden">
        <div className="flex pt-[16px] pr-[20px] pb-[16px] pl-[20px] gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative">
          <span className="h-[26px] grow shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[26px] text-[#1c1c1e] tracking-[-0.6px] relative text-left whitespace-nowrap">
            Customer Reviews (5)
          </span>
        </div>
        
        <div className="flex pt-[20px] pr-[30px] pb-[20px] pl-[30px] flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative">
          <div className="flex flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative">
            {/* Rating Overview */}
            <div className="flex flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative">
              <div className="h-[95px] self-stretch shrink-0 relative">
                <div className="w-[62px] h-[46px] text-[0px] absolute top-[10px] left-0">
                  <span className="block h-[22px] font-Metropolis text-[44px] font-semibold leading-[22px] text-[#222222] tracking-[-0.41px] relative text-left whitespace-nowrap mt-0 mr-0 mb-0 ml-0">
                    4.3
                  </span>
                  <span className="block h-[8px] font-Metropolis text-[14px] font-normal leading-[8px] text-[#9b9b9b] relative text-left whitespace-nowrap mt-[16px] mr-0 mb-0 ml-[1px]">
                    23 ratings
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-[16px] justify-center items-start self-stretch shrink-0 flex-nowrap relative">
                <span className="h-[16px] self-stretch shrink-0 basis-auto font-['Poppins'] text-[14px] font-semibold leading-[16px] text-[#1c1c1e] tracking-[-0.42px] relative text-left whitespace-nowrap">
                  Do you own this product?
                </span>
                <div className="flex h-[40px] items-start self-stretch shrink-0 flex-nowrap relative">
                  <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[16px] justify-center items-center self-stretch grow shrink-0 basis-0 flex-nowrap bg-[#7076fe] rounded-[10px] relative">
                    <span className="flex w-[109px] h-[16px] justify-center items-center shrink-0 basis-auto font-['Poppins'] text-[14px] font-semibold leading-[16px] text-[#fff] tracking-[0.28px] relative text-center whitespace-nowrap">
                      Write a Review
                    </span>
                    <div className="w-[16px] h-[16px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/HTUHmnQZYV.png)] bg-cover bg-no-repeat relative" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reviews List */}
            {reviews.map((review, index) => (
              <React.Fragment key={index}>
                <ReviewCard {...review} />
                {index < reviews.length - 1 && (
                  <div className="h-px self-stretch shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/Fr96itGJfW.png)] bg-cover bg-no-repeat relative" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="h-px self-stretch shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/kQtynziLXj.png)] bg-cover bg-no-repeat relative" />
          <div className="flex w-[153px] gap-[24px] items-center shrink-0 flex-nowrap relative">
            <div className="flex w-[153px] pt-[24px] pr-0 pb-[24px] pl-0 gap-[10px] justify-center items-center shrink-0 flex-nowrap relative">
              <span className="h-[16px] shrink-0 basis-auto font-['Poppins'] text-[12px] font-normal leading-[15.6px] text-[#007aff] tracking-[0.36px] relative text-left whitespace-nowrap">
                Show 2 more comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewsSection;
