import React from 'react';
import { SellerReviewCard } from './SellerReviewCard';

const SellerReviewsSection: React.FC = () => {
    const reviews = [
        {
            rating: 5,
            comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
            tags: ["Inner Awakening", "Cosmic Union", "Impactful"],
            author: {
                name: "Gregory Howard",
                initials: "GH",
                timeAgo: "1day ago"
            },
            image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',
        },
        {
            rating: 5,
            comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
            tags: ["Inner Awakening", "Cosmic Union"],
            author: {
                name: "Gregory Howard",
                initials: "GH",
                timeAgo: "1day ago"
            },
            image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',

        },
        {
            rating: 5,
            comment: "Felt a deep sense of presence and flow. Energy rising through every breath.",
            tags: ["Inner Awakening", "Cosmic Union"],
            author: {
                name: "Gregory Howard",
                initials: "GH",
                timeAgo: "1day ago"
            },
            image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',

        }
    ];

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col bg-[#f9f9f9] rounded-[21px] border border-[#cbd5e1] overflow-hidden">
                {/* Header */}
                <div className="px-4 pt-4 md:px-5 md:pt-5 pb-0">
                    <h2 className="font-['Poppins'] text-lg md:text-xl font-semibold text-[#1c1c1e] tracking-[-0.6px]">
                        Recent Notifications
                    </h2>
                </div>

                <div className="px-4 py-5 md:px-6 md:py-6 flex flex-col gap-6 md:gap-8">
                    {/* Reviews List */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        {reviews.map((review, index) => (
                            <React.Fragment key={index}>
                                <SellerReviewCard {...review} />
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

export default SellerReviewsSection;