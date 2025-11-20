import { useNavigate, useParams } from 'react-router-dom';
// import cnessicon from '../assets/cnessicon.svg';
import ProductCard from '../components/MarketPlace/ProductCard';
import { ChevronDown, ChevronUp, Heart, PlayCircle, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { AddProductToCart, AddProductToWishlist, BuyerCanReview, BuyerOwnReview, GetMarketPlaceBuyerProductById, GetMarketPlaceBuyerProducts, GetProductReviws, RemoveProductToCart, RemoveProductToWishlist } from '../Common/ServerAPI';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CiFacebook, CiInstagram, CiLinkedin, CiYoutube } from 'react-icons/ci';
import { RiTwitterXFill } from 'react-icons/ri';
import { IoLogoTiktok } from 'react-icons/io5';
import { FaPinterestP } from 'react-icons/fa';
import { useToast } from '../components/ui/Toast/ToastProvider';
import { IoMdShareAlt } from 'react-icons/io';
import ReviewModal from '../components/MarketPlace/ReviewModal';
import DOMPurify from "dompurify";
import { useCartWishlist } from '../components/MarketPlace/context/CartWishlistContext';

const socialMediaPlatforms = [
  { key: 'facebook', name: 'Facebook', icon: <CiFacebook size={25} className='text-gray-500' /> },
  { key: 'instagram', name: 'Instagram', icon: <CiInstagram size={25} className='text-gray-500' /> },
  { key: 'youtube', name: 'YouTube', icon: <CiYoutube size={25} className='text-gray-500' /> },
  { key: 'twitter', name: 'Twitter', icon: <RiTwitterXFill size={25} className='text-gray-500' /> },
  { key: 'tiktok', name: 'TikTok', icon: <IoLogoTiktok size={25} className='text-gray-500' /> },
  { key: 'linkedin', name: 'LinkedIn', icon: <CiLinkedin size={25} className='text-gray-500' /> },
  { key: 'pinterest', name: 'Pinterest', icon: <FaPinterestP size={25} className='text-gray-500' /> },
] as const;

const ProductDetail = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { incrementCart, decrementCart, incrementWishlist, decrementWishlist, updateCartCount, updateWishlistCount } = useCartWishlist();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openChapter, setOpenChapter] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isCarted, setIsCarted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await GetMarketPlaceBuyerProductById(id);
        const productData = response?.data?.data;
        setProduct(productData);
        console.log("ART SAMPLE → ",
  productData?.product_details?.sample_image_url
);
console.log("FULL PRODUCT → ", productData);
        setIsLiked(productData?.is_in_wishlist || false);
        setIsCarted(productData?.is_in_cart || false);
      } catch (error: any) {
        showToast({
          message: "Failed to load product details",
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await GetMarketPlaceBuyerProducts();

        const products = response?.data?.data?.products?.slice(0, 10) || [];
        setFeaturedProducts(products);
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (id) {
      checkReviewPermissions();
      fetchReviews();
    }
  }, [id]);

  const checkReviewPermissions = async () => {
    try {
      const response = await BuyerCanReview(id);
      const data = response?.data?.data;

      setCanReview(data?.can_review || false);
      setHasPurchased(data?.has_purchased || false);
      setHasReviewed(data?.has_reviewed || false);

      // If user has reviewed, fetch their review
      if (data?.has_reviewed) {
        await fetchUserReview();
      }
    } catch (error: any) {
      console.error("Failed to check review permissions:", error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await BuyerOwnReview(id);
      const data = response?.data?.data;

      if (data?.has_reviewed && data?.review) {
        setUserReview(data.review);
      }
    } catch (error: any) {
      console.error("Failed to fetch user review:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await GetProductReviws(id ? id : '', {
        page: 1,
        limit: 3, // Only show 3 reviews on detail page
      });

      const data = response?.data?.data;
      const reviewsData = data?.reviews || [];
      const summary = data?.rating_summary || null;

      setReviews(reviewsData);

      // Calculate review stats from rating summary
      if (summary) {
        const distribution = summary.rating_distribution || {};
        const totalRatings = summary.total_ratings || 0;

        const calculatePercentage = (count: number) =>
          totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        setReviewStats({
          average_rating: summary.average_rating,
          total_reviews: totalRatings,
          five_star_percentage: calculatePercentage(distribution["5"] || 0),
          four_star_percentage: calculatePercentage(distribution["4"] || 0),
          three_star_percentage: calculatePercentage(distribution["3"] || 0),
          two_star_percentage: calculatePercentage(distribution["2"] || 0),
          one_star_percentage: calculatePercentage(distribution["1"] || 0),
        });
      }
    } catch (error: any) {
      console.error("Failed to load reviews:", error);
    }
  };

  // const handleDeleteReview = async (reviewId: string) => {
  //   if (!confirm("Are you sure you want to delete this review?")) return;

  //   try {
  //     await DeleteBuyerReview(reviewId);
  //     showToast({
  //       message: "Review deleted successfully",
  //       type: "success",
  //       duration: 2000,
  //     });
  //     fetchReviews();
  //   } catch (error: any) {
  //     showToast({
  //       message: "Failed to delete review",
  //       type: "error",
  //       duration: 3000,
  //     });
  //   }
  // };

  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleViewMyReview = () => {
    if (userReview) {
      setIsReviewModalOpen(true);
    }
  };

  const toggleChapter = (index: number) => {
    setOpenChapter(openChapter === index ? null : index);
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (isAddingToCart || !product) return;

    setIsAddingToCart(true);
    try {
      if (isCarted) {
        await RemoveProductToCart(product.id);
        setIsCarted(false);
        showToast({
          message: "Removed from cart",
          type: "success",
          duration: 2000,
        });
        await decrementCart();
      } else {
        await AddProductToCart({ product_id: product.id });
        setIsCarted(true);
        showToast({
          message: "Added to cart",
          type: "success",
          duration: 2000,
        });
        await incrementCart();
      }
      await updateCartCount();
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to update cart",
        type: "error",
        duration: 3000,
      });

      setIsCarted((prevState) => !prevState);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await AddProductToCart({
        product_id: product.id,
        quantity: 1,
      });
      navigate("/dashboard/checkout");
    } catch (error: any) {
      console.error("Buy now error:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Failed to proceed",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = async () => {
    if (isAddingToWishlist || !product) return;

    setIsAddingToWishlist(true);
    try {
      if (isLiked) {
        await RemoveProductToWishlist(product.id);
        setIsLiked(false);
        showToast({
          message: "Removed from wishlist",
          type: "success",
          duration: 2000,
        });
        await decrementWishlist();
      } else {
        await AddProductToWishlist({ product_id: product.id });
        setIsLiked(true);
        showToast({
          message: "Added to wishlist ❤️",
          type: "success",
          duration: 2000,
        });
        await incrementWishlist();
      }
      await updateWishlistCount();
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to update wishlist",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const getContentStructure = () => {
    if (!product?.product_details) return null;

    const categorySlug = product?.category?.slug;
    const details = product.product_details;

    switch (categorySlug) {
      case 'video':
        return {
          type: 'video',
          items: details.video_files || [],
          duration: details.duration,
        };

      case 'music':
        return {
          type: 'music',
          items: details?.tracks ? details.tracks : [],
          duration: details.duration,
          format: details.format,
          theme: details.theme,
        };

      case 'podcast':
        return {
          type: 'podcast',
          items: details.episodes || [],
          duration: details.duration,
          format: details.format,
          theme: details.theme,
        };

      case 'art':
      case 'course':
      case 'ebook':
        return {
          type: 'chapters',
          items: details.chapters || [],
          theme: details.theme,
          mediums: details.mediums,
          modern_trends: details.modern_trends,
        };

      default:
        return null;
    }
  };

  const contentStructure = getContentStructure();

  const ratingData = reviewStats
    ? [
      { stars: 5, percentage: reviewStats.five_star_percentage || 0, color: "bg-[#F8B814]" },
      { stars: 4, percentage: reviewStats.four_star_percentage || 0, color: "bg-[#F8B814]" },
      { stars: 3, percentage: reviewStats.three_star_percentage || 0, color: "bg-[#F8B814]" },
      { stars: 2, percentage: reviewStats.two_star_percentage || 0, color: "bg-[#F8B814]" },
      { stars: 1, percentage: reviewStats.one_star_percentage || 0, color: "bg-[#F8B814]" },
    ]
    : [
      { stars: 5, percentage: 0, color: "bg-[#F8B814]" },
      { stars: 4, percentage: 0, color: "bg-[#F8B814]" },
      { stars: 3, percentage: 0, color: "bg-[#F8B814]" },
      { stars: 2, percentage: 0, color: "bg-[#F8B814]" },
      { stars: 1, percentage: 0, color: "bg-[#F8B814]" },
    ];

 const details = [
  {
    icon: "https://static.codia.ai/image/2025-10-16/wo8469r2jf.png",
    label: "Duration",
    value: product?.product_details?.duration || "Not available",
  },
  {
    icon: "https://static.codia.ai/image/2025-10-16/dCQ1oOqZNv.png",
    label: "Language",
    value: product?.product_details?.language || product?.language || "Not available",
  },
  {
    icon: "https://static.codia.ai/image/2025-10-16/Kzho4cnKy1.png",
    label: "Format",
    value: product?.product_details?.format || product?.format || product?.category?.name,
  },
 // {
   // icon: "https://static.codia.ai/image/2025-10-16/9eNhkyRAT7.png",
   // label: "Requirements",
  //  value: product?.product_details?.requirements || "N/A",
 // },
];

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <main className=" min-h-screen bg-white">
      <div
        className={` transition-all duration-300 ${isMobileNavOpen ? "md:ml-64" : "md:ml-0"
          } pt-[30px] px-6`}
      >
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-8">
            {/* Product Image */}
            <div className="shrink-0">
              <img
                src={product.thumbnail_url || "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png"}
                alt={product.product_name}
                className="w-[533px] h-[304px] rounded-lg object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-4 -mt-7">
              <div className="text-sm text-gray-500">
                {product?.mood?.name} / {product?.category?.name} / {product?.seller?.shop_name}
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {product.product_name}
              </h1>

             {product?.moods && product.moods.length > 0 && (
  <div className="flex items-center gap-2 flex-wrap mt-2">
    {product.moods.map((mood: any) => (
      <span
        key={mood.id}
        className="bg-purple-50 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
      >
        {mood.icon} {mood.name}
      </span>
    ))}
  </div>
)}
              {/* Author and Stats */}
              <div className="flex items-center space-x-4 text-sm ">
                <div className="flex items-center space-x-2">
                  <img
                    src={product?.seller?.shop_logo || 'https://static.codia.ai/image/2025-10-16/1Uq1yJR1AG.png'}
                    alt={product?.seller?.shop_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900">
                    {product?.seller?.shop_name}
                  </span>
                  <img src="https://static.codia.ai/image/2025-10-16/4CY6MqmRhj.png" alt="Verified" className="w-4 h-4" />
                </div>

                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>

                <div className="flex items-center space-x-1">
                  <img src="https://static.codia.ai/image/2025-10-16/yNGhX01DCH.png" alt="Star" className="w-5 h-5" />
                  <span className="text-gray-900">
                    {product?.rating?.average} ({product?.rating?.total_reviews})
                  </span>
                </div>

                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>

                <div className="flex items-center space-x-1">
                  <img src="https://static.codia.ai/image/2025-10-16/92zn9LKBU3.png" alt="Downloads" className="w-5 h-5" />
                  <span className="text-gray-900">{product?.purchase_count} purchases</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex gap-2.5 items-center">
                {parseFloat(product.discount_percentage) > 0 && (
                  <span className="text-[32px] font-poppins font-light text-[#CBC9C9] line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  <span className="text-[32px] font-poppins font-semibold text-[#1A1A1A]">
                    ${parseFloat(product.discounted_price).toFixed(2)}
                  </span>
                  {parseFloat(product.discount_percentage) > 0 && (
                    <span className="text-xs font-normal font-['Open_Sans'] text-[#7077FE]">
                      ({parseFloat(product.discount_percentage).toFixed(0)}% off)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBuyNow}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
                  <img src="https://static.codia.ai/image/2025-10-16/LUafay60N9.png" alt="Buy" className="w-6 h-6" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`flex items-center space-x-2 border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <img src="https://static.codia.ai/image/2025-10-16/VUQR3XLDmc.png" alt="Cart" className="w-6 h-6" />
                  <span>
                    {isAddingToCart ? 'Adding...' : isCarted ? 'Added to cart' : 'Add to cart'}
                  </span>
                </button>

                <button className="p-3 border border-blue-500 rounded-lg hover:bg-blue-50">
                  <IoMdShareAlt className='text-[#7077FE]' size={24} />
                </button>
              </div>

              <div className="text-sm text-blue-500">*Lifetime access</div>
            </div>

            {/* Wishlist Button */}
            <div className="shrink-0 relative -top-30">
              <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className="p-2">
                <Heart
                  className={`w-9 h-9 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Description and Details Section */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-5 mt-6">
          {/* Overview */}
          <div className="space-y-4">
            <h2
              className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900"
            >Overview</h2>
            <div className="rich-text-content font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black
                               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                               [&_li]:my-1 [&_li]:pl-1
                               [&_p]:my-3
                               [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
                               [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3
                               [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2
                               [&_strong]:font-bold
                               [&_em]:italic
                               [&_u]:underline"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product?.overview),
              }}
            ></div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Highlights:</h2>
            <ul className="space-y-3 list-disc list-inside">
              {(Array.isArray(product.highlights) ? product.highlights : [product.highlights]).map((highlight: string, index: number) => (
                <li key={index} className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Details:</h2>
            <div className="space-y-4">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3 w-48">
                    <img src={detail.icon} alt={detail.label} className="w-5 h-5" />
                    <span className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">{detail.label}</span>
                  </div>
                  <span className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Storytelling Section */}
          {product?.category?.slug === 'video' && (
            <div className="space-y-4">
              <h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Storytelling</h2>
              <div className="flex space-x-4">
                {product?.product_details?.short_preview_video && (
                  <div className="relative">
                    <img
                      src={product?.product_details?.short_preview_video?.thumbnail || "https://static.codia.ai/image/2025-10-16/OqOzCQfESi.png"}
                      alt="Video Preview"
                      className="w-[450px] h-[190px] rounded-lg object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      {/* <p className="text-white text-xs text-center mb-2 font-['Inter']">
                      I was impressed with how seamless the entire process was. From discovery to delivery, everything felt smooth and intuitive.
                    </p> */}
                      <div className="flex items-center justify-center space-x-2 bg-black/40 rounded-full px-5 py-1">
                        <img src="https://static.codia.ai/image/2025-10-16/UaQWMTnCVG.png" alt="Play" className="w-5 h-5" />
                        <span className="text-white text-xs font-['Inter']">00:19 / 20:00</span>
                        <img src="https://static.codia.ai/image/2025-10-16/PKWm76rWV6.png" alt="Progress" className="w-36 h-1" />
                        <div className="bg-white border border-white rounded-lg px-2 py-1">
                          <span className="text-white text-xs font-['Inter']">1X</span>
                        </div>
                        <img src="https://static.codia.ai/image/2025-10-16/EzJzrUMfS9.png" alt="Volume" className="w-5 h-5" />
                        <img src="https://static.codia.ai/image/2025-10-16/3LrbguD4pt.png" alt="Captions" className="w-5 h-5" />
                        <img src="https://static.codia.ai/image/2025-10-16/Fg0hapcr20.png" alt="Fullscreen" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )}
                {product?.product_details?.summary && (
                  <div className="flex-1">
                    <p className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">
                      {product?.product_details?.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Author Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 ">
              <div className="flex items-center space-x-4">
                <img
                  src={product?.seller?.shop_logo || "https://static.codia.ai/image/2025-10-16/03HoRzVdSn.png"}
                  alt={product?.seller?.shop_name}
                  className="w-15 h-15 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {product?.seller?.shop_name}
                    </span>
                    <img src="https://static.codia.ai/image/2025-10-16/bDZghXxif0.png" alt="Verified" className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-gray-500 font-light">Digital Artist</div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4 ml-8">
                {product?.seller?.social_links && socialMediaPlatforms.map((platform) => {
                  const url = product.seller.social_links[platform.key];
                  if (!url) return null;

                  return (
                    <div key={platform.key} className="group relative">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center gap-3
                          h-[60px] px-4
                          rounded-lg border border-gray-300 bg-white
                          overflow-hidden
                          transition-all duration-500 ease-out
                          hover:w-40 w-[60px]
                          shadow-sm
                        "
                      >
                        {/* Icon */}
                        <div className="shrink-0 transition-transform duration-500 ease-out">
                          {platform.icon}
                        </div>

                        {/* Label */}
                        <span className="
                          text-blue-500 text-sm font-medium whitespace-nowrap
                          opacity-0 translate-x-4
                          transition-all duration-500 ease-out
                          group-hover:opacity-100 group-hover:translate-x-0
                        ">
                          {platform.name}
                        </span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View Store Button */}
            <button
              onClick={() => navigate(`/dashboard/shop-detail/${product?.seller?.shop_id}`)}
              className="flex items-center space-x-2 bg-[#7077FE] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7077FE]">
              <img
                src="https://static.codia.ai/image/2025-10-16/t3md55f2ZY.png" alt="Store"
                className="w-6 h-6"
              />
              <span>View Store</span>
            </button>
          </div>
        </div>




 {product?.product_details?.sample_image_url && (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="font-[Poppins] font-semibold text-[20px] text-[#242E3A] mb-4">
        Sample Preview
      </h2>

      <div className="w-full flex justify-center">
        <img
          src={product.product_details.sample_image_url}
          alt="Art Sample Preview"
          className="max-w-[400px] rounded-lg shadow-md border object-cover"
        />
      </div>

      <p className="text-center mt-2 text-gray-500 text-sm">
        Watermarked sample preview
      </p>
    </div>
)}


        {(product?.category?.slug === 'music' || product?.category?.slug === 'podcast') &&
          product?.product_details?.sample_track && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="font-[Poppins] font-semibold text-[20px] text-[#242E3A] mb-4">
                Sample {product?.category?.slug === 'music' ? 'Track' : 'Episode'}
              </h2>
              <div className="border border-gray-200 rounded-lg p-4 bg-[#F9FAFB]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#7077FE]/10 rounded-lg flex items-center justify-center shrink-0">
                    <PlayCircle className="w-8 h-8 text-[#7077FE]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[Poppins] font-medium text-[16px] text-[#242E3A] mb-1">
                      Sample Preview
                    </h3>
                    <p className="text-sm text-gray-500">
                      Listen to a preview before purchasing
                    </p>
                  </div>
                  <audio
                    controls
                    className="h-10"
                    preload="metadata"
                  >
                    <source src={product?.product_details?.sample_track?.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          )}

        {product?.category?.slug !== 'video' && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6 ">
            <h2 className="font-[Poppins] text-[20px] sm:text-[22px] font-semibold text-[#242E3A] mb-6 ">
              {product?.category?.slug === 'music' ? 'Music' :
                product?.category?.slug === 'podcast' ? 'Podcast' :
                  product?.category?.slug === 'ebook' ? 'Ebook' :
                    product?.category?.slug === 'course' ? 'Course' :
                      'Art'}{" "}
              Content
            </h2>
            <div className="border border-gray-100 ">
            </div>

            {contentStructure && contentStructure.items && contentStructure.items.length > 0 && (
              <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
              <h2 className="font-[Poppins] font-semibold text-[20px] sm:text-[22px] text-[#242E3A] mb-6">
  {(() => {
    switch (product?.category?.slug) {
      case "music": return "Tracks";
      case "podcast": return "Episodes";
      case "video": return "Videos";
      case "course": return "Course Content";
      case "ebook": return "Ebook Content";
      case "art": return "Art Gallery";
      default: return "Content";
    }
  })()}
</h2>
                <div className="border border-gray-100"></div>

                <div className="divide-y divide-gray-200">
                  {contentStructure?.items?.length ?
                    contentStructure?.items?.map((item: any, i: number) => {
                      console.log('itegfgjm', item)
                      if (!item) {
                        return (
                          <div className="col-span-full text-center py-10 text-gray-500">
                            No content available
                          </div>
                        );
                      }

                      return (
                        <div key={item.id || i} className="py-4">
                          {/* Chapter/Track/Episode Header */}
                          <button
                            onClick={() => toggleChapter(i)}
                            className="w-full flex justify-between items-center text-left"
                          >
                            <div>
                              {item.title ? (
                                <h3 className="font-[Poppins] font-semibold text-[#242E3A] text-[16px]">
                                  {item.title}
                                </h3>
                              ) : (
                                <h3 className="font-[Poppins] font-semibold text-[#242E3A] text-[16px]">
                                  {`Item ${i + 1}`}
                                </h3>
                              )}
                              {item.duration && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.files?.length || 0} Files • {item.duration}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              )}
                            </div>
                            {openChapter === i ? (
                              <ChevronUp className="text-gray-500" />
                            ) : (
                              <ChevronDown className="text-gray-500" />
                            )}
                          </button>

                          {/* Files */}
                          <div
                            className={`transition-all duration-300 overflow-hidden ${openChapter === i ? "max-h-[500px] mt-4" : "max-h-0"
                              }`}
                          >
                            <div className="flex flex-col gap-3 pl-6 mt-2">
                              {item.files && item.files.map((file: any, j: number) => (
                                <div
                                  key={j}
                                  className="flex justify-between items-center bg-[#F9FAFB] px-4 py-3 rounded-lg hover:bg-[#EEF2FF] transition"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-5 h-5 text-[#7077FE]" />
                                    <p className="text-[15px] text-[#242E3A]">
                                      {file.title || `File ${j + 1}`}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500">{file.file_type}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        No content available
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mt-6">
          <div className="flex space-x-8">
            <div className="w-96 border border-gray-200 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-semibold text-gray-900 mb-2">{product?.rating?.average || "0.0"}

                </div>
                <div className="text-gray-500">
                  Based on {product?.rating?.total_reviews || 0} reviews
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {ratingData.map((rating, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center w-[50px]">
                      <span className="text-blue-500 text-lg">{rating.stars}</span>
                      <img src="https://static.codia.ai/image/2025-10-16/g9soS0qbLX.png" alt="Star" className="w-6 h-6" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`${rating.color} h-3 rounded-full`}
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-lg w-12 text-right">
                      {rating.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>

              {!hasPurchased ? (
                null
              ) : hasReviewed ? (
                <button
                  onClick={handleViewMyReview}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  View My Review
                </button>
              ) : canReview ? (
                <button
                  onClick={handleWriteReview}
                  className="w-full bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#5E65F6] transition"
                >
                  Write a Review
                </button>
              ) : null}
            </div>

            {/* Reviews List */}
            <div className="flex-1 space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-[Open_Sans]">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              ) : (
                <>
                  {reviews.map((review) => (
                    <div
                      key={review.review_id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={
                            review.user?.profile_picture ||
                            "https://static.codia.ai/image/2025-10-16/e90dgbfC6H.png"
                          }
                          alt={review.user?.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-start gap-1 font-medium text-gray-900 mb-1">
                            <p className="font-[Poppins]">
                              {review.user?.username}
                            </p>
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
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 font-[Poppins]">
                            {review.review_title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed font-[Open_Sans]">
                            {review.review_text}
                          </p>
                          <div className="pt-3 flex space-x-3">
                            {['Focused', 'Emotional'].map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-7 py-3 border border-gray-300 rounded-full text-sm text-gray-600 font-['Plus_Jakarta_Sans']"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {/* <p className="text-xs text-gray-400 mt-2 font-[Open_Sans]">
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {reviews.length > 3 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/product-review/${product.id}`, {
                        state: { product },
                      })
                    }
                    className="flex justify-center items-center w-[102px] bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#5E65F6] transition-colors duration-200"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* recommended Products Section */}

<div className="flex flex-col gap-[34px] mt-8 w-full">
          <div className="flex flex-col gap-5">
            <h2 className="font-[Poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A] text-center">
              Recommended products
            </h2>

<div className="w-full px-4">
<div className="grid gap-4
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
               {featuredProducts.length > 0 ? (
                featuredProducts?.map((product, index) => {
                  if (index < 10) {
                    return (
                      <ProductCard
                        key={product.id}
                        product={{
                          id: product.id,
                          title: product?.product_name,
                          author: product.author,
                          rating: product?.rating?.average,
                          reviews: product?.rating?.total_reviews,
                          currentPrice: product?.discounted_price,
                          originalPrice: product?.price,
                          discount: product.discount_percentage,
                          duration: product.video_details?.duration || product.music_details?.total_duration || "00:00:00",
                         moods: product?.moods || [],
                          image:
                            product.thumbnail_url ||
                            "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                          category: product.category?.name || "",
                          isLike: product?.is_in_wishlist,
                          isCarted: product?.is_in_cart,
                        }}
                      />
                    )
                  }
                })
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No Recommended products found
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
        }}
        productId={product?.id}
        onSuccess={() => {
          checkReviewPermissions();
          fetchReviews();
        }}
        existingReview={hasReviewed ? userReview : null}
        viewMode={hasReviewed}
      />
    </main>
  );
}

export default ProductDetail;
