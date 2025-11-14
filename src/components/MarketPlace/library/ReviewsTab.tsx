import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { BuyerOwnReview, CreateBuyerReview, GetProductReviws, UpdateBuyerReview } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface ReviewsTabProps {
    productId: string;
    show_public_review: boolean;
    show_overall_review:boolean
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ productId,show_public_review=true,show_overall_review=true }) => {
    const { showToast } = useToast();

    const [allReviews, setAllReviews] = useState<any[]>([]);
    const [ratingStats, setRatingStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [hasReviewed, setHasReviewed] = useState(false);
    const [userReview, setUserReview] = useState<any>(null);

    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    const resonanceOptions = [
        "Focused",
        "Emotional",
        "Energetic",
        "Relaxing",
        "Inspiring",
        "Creative",
    ];

    useEffect(() => {
        if (productId) {
            checkReviewPermissions();
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await GetProductReviws(productId, {
                page: 1,
                limit: 100,
            });

            const data = response?.data?.data;
            setAllReviews(data?.reviews || []);

            const summary = data?.rating_summary;
            if (summary) {
                const distribution = summary.rating_distribution || {};
                const totalRatings = summary.total_ratings || 0;

                const calculatePercentage = (count: number) =>
                    totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;

                setRatingStats({
                    average_rating: parseFloat(summary.average_rating || "0").toFixed(1),
                    total_reviews: totalRatings,
                    distribution: {
                        5: calculatePercentage(distribution["5"] || 0),
                        4: calculatePercentage(distribution["4"] || 0),
                        3: calculatePercentage(distribution["3"] || 0),
                        2: calculatePercentage(distribution["2"] || 0),
                        1: calculatePercentage(distribution["1"] || 0),
                    },
                });
            }
        } catch (error: any) {
            console.error("Failed to load reviews:", error);
            showToast({
                message: "Failed to load reviews",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const checkReviewPermissions = async () => {
        try {
            const response = await BuyerOwnReview(productId);
            const data = response?.data?.data;

            setHasReviewed(data?.has_reviewed || false);

            // If user has reviewed, find and set their review
            if (data?.has_reviewed && data?.review) {
                setUserReview(data.review);
                setEditingReviewId(data.review.review_id);
                setRating(data.review.rating);
                setReviewTitle(data.review.review_title || "");
                setReviewText(data.review.review_text);
                setSelectedTags(data.review.resonance_tags || []);
            }
        } catch (error: any) {
            console.error("Failed to check review permissions:", error);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const resetForm = () => {
        setRating(0);
        setHoveredRating(0);
        setReviewTitle("");
        setReviewText("");
        setSelectedTags([]);
        setEditingReviewId(null);

        if (hasReviewed && userReview) {
            setEditingReviewId(userReview.review_id);
            setRating(userReview.rating);
            setReviewTitle(userReview.review_title || "");
            setReviewText(userReview.review_text);
            setSelectedTags(userReview.resonance_tags || []);
        }
    };

    const submitReview = async () => {
        if (rating === 0) {
            showToast({
                message: "Please select a rating",
                type: "error",
                duration: 2000,
            });
            return;
        }

        if (!reviewTitle.trim() || !reviewText.trim()) {
            showToast({
                message: "Please fill in all fields",
                type: "error",
                duration: 2000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                product_id: productId,
                rating: rating,
                review_title: reviewTitle.trim(),
                review_text: reviewText.trim(),
                resonance_tags: selectedTags,
            };

            if (hasReviewed && editingReviewId) {
                // Update existing review
                await UpdateBuyerReview({
                    ...reviewData,
                    review_id: editingReviewId,
                });
                resetForm();
                showToast({
                    message: "Review updated successfully! ✨",
                    type: "success",
                    duration: 3000,
                });
            } else {
                // Create new review
                await CreateBuyerReview(reviewData);
                resetForm();
                showToast({
                    message: "Review submitted successfully! ✨",
                    type: "success",
                    duration: 3000,
                });

                setHasReviewed(true);
            }

            // Refresh reviews and permissions
            await checkReviewPermissions();
            await fetchReviews();
        } catch (error: any) {
            showToast({
                message:
                    error?.response?.data?.error?.message ||
                    `Failed to ${hasReviewed ? "update" : "submit"} review`,
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingData = ratingStats
        ? [
            { stars: 5, percentage: ratingStats.distribution[5] || 0 },
            { stars: 4, percentage: ratingStats.distribution[4] || 0 },
            { stars: 3, percentage: ratingStats.distribution[3] || 0 },
            { stars: 2, percentage: ratingStats.distribution[2] || 0 },
            { stars: 1, percentage: ratingStats.distribution[1] || 0 },
        ]
        : [
            { stars: 5, percentage: 0 },
            { stars: 4, percentage: 0 },
            { stars: 3, percentage: 0 },
            { stars: 2, percentage: 0 },
            { stars: 1, percentage: 0 },
        ];

    const avgRating = ratingStats?.average_rating || "0.0";
    const totalReviews = ratingStats?.total_reviews || 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div>
            {/* --- Rating Summary (Top) --- */}
            {show_overall_review ?(
            <div className="w-full mx-auto rounded-lg bg-white p-6 shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main left */}
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[40px] font-bold leading-none text-[#1A1A1A] font-[Poppins]">
                        {avgRating}
                    </span>
                    <span className="text-[16px] text-[#848484] mt-2 font-[Poppins]">
                        Based on <strong className="font-semibold">{totalReviews}</strong> reviews
                    </span>
                </div>

                {/* Ratings breakdown */}
                <div className="flex flex-col justify-center space-y-3">
                    {ratingData.map((rating) => (
                        <div className="flex items-center gap-3" key={rating.stars}>
                            <div className="flex items-center w-[40px] shrink-0">
                                <span className="text-[#7077FE] text-sm font-semibold">
                                    {rating.stars}
                                </span>
                                <Star className="w-4 h-4 ml-1 fill-[#7077FE] text-[#7077FE]" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                                <div
                                    className="bg-[#F8B814] h-2 rounded-full absolute top-0 left-0"
                                    style={{
                                        width: `${rating.percentage}%`,
                                        transition: "width 0.4s",
                                    }}
                                ></div>
                            </div>
                            <span className="text-gray-500 text-xs w-[50px] text-right">
                                {rating.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            ): <div><br/></div>}

            {/* --- Review Entry Form --- */}
            <div className="mx-auto p-6 bg-white rounded shadow space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-[Poppins] font-semibold text-[18px] text-[#1A1A1A]">
                        {hasReviewed ? "Edit Your Review" : "Write a Review"}
                    </h3>
                    {hasReviewed && (
                        <span className="text-xs text-[#7077FE] bg-purple-50 px-3 py-1 rounded-full font-[Open_Sans]">
                            You've already reviewed this product
                        </span>
                    )}
                </div>

                {/* Rating Stars */}
                <div>
                    <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110 cursor-pointer"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? "fill-[#F8B814] text-[#F8B814]"
                                        : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600 font-[Open_Sans]">
                                {rating} {rating === 1 ? "star" : "stars"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Review Title */}
                <div>
                    <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
                        Review Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g., Amazing product!"
                        maxLength={100}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7077FE] font-[Open_Sans] text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[Open_Sans]">
                        {reviewTitle.length}/100 characters
                    </p>
                </div>

                {/* Resonance Tag Selection */}
                <div>
                    <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
                        Select Resonance Tags (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {resonanceOptions.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag)
                                    ? "bg-[#7077FE] text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                type="button"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={5}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7077FE] font-[Open_Sans] text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[Open_Sans]">
                        {reviewText.length}/500 characters
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    onClick={submitReview}
                    disabled={isSubmitting || rating === 0 || !reviewTitle.trim() || !reviewText.trim()}
                    className={`w-full px-4 py-3 rounded-lg font-[Plus_Jakarta_Sans] font-medium text-sm text-white transition ${isSubmitting || rating === 0 || !reviewTitle.trim() || !reviewText.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#7077FE] hover:bg-[#5E65F6]"
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {hasReviewed ? "Updating..." : "Submitting..."}
                        </span>
                    ) : (
                        hasReviewed ? "Update Review" : "Submit Review"
                    )}
                </button>

                {/* Review List */}
                {show_public_review &&(
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 font-[Poppins]">
                        Customer Reviews ({totalReviews})
                    </h3>
                    {allReviews.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm font-[Open_Sans]">
                                No reviews yet. Be the first to review this product!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {allReviews.map((review) => {
                                const isOwnReview = hasReviewed && review.review_id === editingReviewId;

                                return (
                                    <div
                                        key={review.review_id}
                                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4 mb-3">
                                            <img
                                                src={
                                                    review.user?.profile_picture ||
                                                    "https://static.codia.ai/image/2025-10-16/e90dgbfC6H.png"
                                                }
                                                alt={review.user?.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-900 font-[Poppins]">
                                                        {review.user?.username || "Anonymous"}
                                                        {isOwnReview && (
                                                            <span className="ml-2 text-xs text-[#7077FE] bg-purple-50 px-2 py-0.5 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500 font-[Open_Sans]">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= review.rating
                                                                ? "fill-[#F8B814] text-[#F8B814]"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {review.review_title && (
                                            <h4 className="font-semibold text-sm text-gray-900 mb-2 font-[Poppins]">
                                                {review.review_title}
                                            </h4>
                                        )}

                                        <p className="text-gray-700 text-sm leading-relaxed font-[Open_Sans] mb-3">
                                            {review.review_text}
                                        </p>

                                        {/* Tags */}
                                        {review.resonance_tags && review.resonance_tags.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {review.resonance_tags.map((tag: string, tagIndex: number) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 font-[Open_Sans]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Verified Purchase Badge */}
                                        {review.is_verified_purchase && (
                                            <div className="mt-3">
                                                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Verified Purchase
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;