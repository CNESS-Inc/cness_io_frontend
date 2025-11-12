import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/MarketPlace/ProductCard";
import { useEffect, useState } from "react";
import { GetMarketPlaceBuyerProducts } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

export default function EmptyPageLibrary() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();

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

  return (
    <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300
      px-4 py-4 pb-14
      sm:px-0 sm:py-0
      md:px-0 md:py-0
      lg:px-0 lg:py-0
      xl:px-0 xl:py-0
      2xl:px-0 2xl:py-0"
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <h2
          className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6
            sm:text-[18px] sm:mt-6 sm:mb-3
            md:text-[20px] md:mt-8 md:mb-4
            lg:text-[20px] xl:text-[20px]
          "
        >
          Library
        </h2>
        {/* Empty state */}
        <div className="w-full flex justify-center items-center flex-1">
          <div className="w-[280px] w-full h-auto flex flex-col items-center text-center gap-4
            sm:w-[320px] sm:gap-5 sm:mt-2
            md:w-[350px] md:gap-6 md:mt-4
            lg:w-[367px] lg:mt-8
          ">
            <img
              src="https://cdn.cness.io/library.svg"
              alt="Empty box"
              className="w-[180px] h-[120px] object-contain
                sm:w-[220px] sm:h-[150px]
                md:w-[260px] md:h-[180px]
                lg:w-[297px] lg:h-[215px]
              "
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/png/featured-1.png";
              }}
            />
            <div>
              <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
                No digital treasures here yet!
              </p>
              <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
                Buy your first digital product and make this space yours.
              </p>
            </div>
            <Link
              to="/dashboard/market-place"
              className="inline-flex items-center gap-2 px-4 py-2
                rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition
                sm:px-5 sm:py-2 md:px-6 md:py-2.5
              "
            >
              <span className="text-[13px] sm:text-[14px]">Browse Marketplace</span>
            </Link>
          </div>
        </div>
        {/* Recommended Products */}
        <section className="px-0 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-14">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-center text-slate-800 font-semibold text-[17px] sm:text-[19px] md:text-[21px]">
              Recommended Products
            </h3>
            {/* Category Tabs – add if needed */}
          </div>
          <div className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2
            mb-6 sm:gap-6 md:gap-7 lg:gap-4 xl:gap-6
          ">
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
                        mood: product?.mood_name,
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
          <div className="flex justify-center">
            <button 
            onClick={() => navigate('/dashboard/market-place/search')}
            className="flex items-center space-x-2 px-5 py-2
              border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors
              sm:px-6 sm:py-3 md:px-8 md:py-4
            ">
              <span className="font-jakarta font-medium text-[14px] sm:text-[15px] md:text-[16px]">
                Explore more
              </span>
              <img src="https://static.codia.ai/image/2025-10-15/xZLgath1fZ.png" alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}