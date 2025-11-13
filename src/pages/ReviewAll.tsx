import { useParams } from 'react-router-dom';

import ProductCard from '../components/MarketPlace/ProductCard';
import sort from '../assets/bx_sort.svg';
import { ChevronDown, Star } from "lucide-react";
import Pagination from '../components/MarketPlace/Pagination';
import { useEffect, useState } from 'react';
import { GetMarketPlaceBuyerProductById, GetProductReviws } from '../Common/ServerAPI';
import { useToast } from '../components/ui/Toast/ToastProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Review = {
  review_id: string;
  rating: number;
  review_title: string;
  review_text: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  user: {
    user_id: string;
    username: string;
    profile_picture: string;
  };
};

const ReviewAll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({
    current_page: 1,
    total_pages: 1,
    total_reviews: 0,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    if (id) {
      fetchProductAndReviews();
    }
  }, [id, currentPage, sortBy]);

  const fetchProductAndReviews = async () => {
    setIsLoading(true);
    try {
      // Fetch product details
      const productResponse = await GetMarketPlaceBuyerProductById(id!);
      const productData = productResponse?.data?.data;
      setProduct(productData);

      // Fetch reviews
      const reviewsResponse = await GetProductReviws(id!, {
        page: currentPage,
        limit: 10,
      });

      const data = reviewsResponse?.data?.data;
      setReviews(data?.reviews || []);
      setPagination(data?.pagination || {});

      // Calculate rating percentages
      const summary = data?.rating_summary;
      if (summary) {
        const distribution = summary.rating_distribution || {};
        const totalRatings = summary.total_ratings || 0;

        const calculatePercentage = (count: number) =>
          totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        setRatingStats({
          average_rating: summary.average_rating,
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
      console.error("Failed to load data:", error);
      showToast({
        message: "Failed to load reviews",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-8">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
        {/* Rating Summary Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-2xl p-6 mb-8 gap-6">

          {/* Left: Rating number + text */}
          <div className="flex flex-col items-center justify-center text-center w-full sm:w-[180px]">
            <h2 className="font-['Poppins'] font-semibold text-[40px] leading-[100%] text-[#1A1A1A]">
              {ratingStats?.average_rating || "0.0"}
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] leading-[100%] text-[#848484] mt-2">
              Based on{" "}
              <strong className="font-semibold text-[#848484]">
                {ratingStats?.total_reviews || 0} reviews
              </strong>
            </p>
          </div>

          {/* Middle: Rating bars */}
          <div className="flex-1 space-y-3 w-full sm:w-auto">
            {ratingData.map((rating, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center w-[40px] shrink-0">
                  <span className="text-[#7077FE] text-sm font-semibold">{rating.stars}</span>
                  <img
                    src="https://static.codia.ai/image/2025-10-16/g9soS0qbLX.png"
                    alt="Star"
                    className="w-4 h-4 ml-1"
                  />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden ">
                  <div
                    className="bg-[#F8B814] h-2 rounded-full absolute top-0 left-0 "
                    style={{ width: `${rating.percentage.toFixed(0)}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 text-xs w-[80px] text-right-8">
                  {rating.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          {/* Right: Sort dropdown */}
          <div className="w-full sm:w-[140px] flex justify-end">
            <div className="relative w-full sm:w-auto">
              {/* Icon */}
              <img
                src={sort}
                alt="Sort Icon"
                className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />

              {/* Select Dropdown */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-full pl-10 pr-6 py-3 text-sm text-gray-600 focus:outline-none appearance-none w-full sm:w-auto"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Helpful">Most Helpful</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 font-[Open_Sans]">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
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
                  <div className="flex items-center justify-start gap-1 font-medium text-gray-900 mb-1">
                    <p className="font-semibold text-gray-900">  {review.user?.username}</p>
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

                <h4 className="font-semibold text-sm text-gray-900 mb-1 font-[Poppins]">
                  {review.review_title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed font-[Open_Sans]">
                  {review.review_text}
                </p>

                {/* Tags */}
                <div className="pt-4 flex gap-3 flex-wrap">
                  {['Focused', 'Emotional'].map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-7 py-3 border border-gray-300 rounded-full text-sm text-gray-600 font-['Plus_Jakarta_Sans']"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* ===== RIGHT PRODUCT CARD ===== */}
      <div className="w-full lg:w-[380px] h-fit">
        {product ? (
          <ProductCard
            product={{
              id: product.id,
              title: product.product_name,
              author: product.seller?.shop_name,
              rating: product.rating?.average,
              reviews: product.rating?.total_reviews,
              currentPrice: product.discounted_price,
              originalPrice: product.price,
              discount: product.discount_percentage,
              duration:
                product.video_details?.duration ||
                product.music_details?.total_duration ||
                "00:00:00",
              mood_icon: product?.mood_icon,
              mood: product.mood?.name,
              image:
                product.thumbnail_url ||
                "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
              category: product.category?.name || "",
              isLike: product.is_in_wishlist,
              isCarted: product.is_in_cart,
            }}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center text-gray-500">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAll;
