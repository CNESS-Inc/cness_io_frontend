//import React from 'react'
//import MoodGrid from '../components/MarketPlace/MoodGrid';
//import Header from   '../components/MarketPlace/Marketheader';
//import happy from "../assets/happy.svg";
//import motivated from "../assets/motivated.svg";
//import calm from "../assets/calm.svg";
//import creative from "../assets/creative.svg";
//import sad from "../assets/sad.svg";
//import spiritual from "../assets/Spitirtual.svg";
//import energy from "../assets/energy.svg";
import MoodSelector from '../components/MarketPlace/MoodSelector';
import ProductCard from '../components/MarketPlace/ProductCard';
import digital from "../assets/digital.svg";
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import ShopCard from '../components/MarketPlace/Shopcard';
import { useEffect, useState } from "react";
import { GetMarketPlaceBuyerCategories, GetMarketPlaceBuyerMoods, GetMarketPlaceBuyerProducts, GetMarketPlaceShops, GetTrendingProducts } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Constants
const FEATURED_PRODUCTS_LIMIT = 6;
const SHOPS_DISPLAY_LIMIT = 8;

const MarketPlaceNew = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // Fetch moods, categories, and shops in parallel on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [moodsResponse, categoriesResponse, shopsResponse] = await Promise.all([
          GetMarketPlaceBuyerMoods(),
          GetMarketPlaceBuyerCategories(),
          GetMarketPlaceShops({ limit: SHOPS_DISPLAY_LIMIT, page: 1 })
        ]);

        // Set moods
        if (moodsResponse?.data?.data) {
          setMoods(moodsResponse.data.data);
        }

        // Set categories
        if (categoriesResponse?.data?.data) {
          const cats = categoriesResponse.data.data;
          setCategories(cats);
          if (cats.length > 0) {
            setSelectedCategory(cats[0].slug);
          }
        }

        // Set shops
        if (shopsResponse?.data?.data?.shops) {
          setShops(shopsResponse.data.data.shops);
        }
      } catch (error: any) {
        showToast({
          message: "Failed to load marketplace data.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsLoadingShops(false);
      }
    };

    setIsLoadingShops(true);
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!selectedCategory) return;

      setIsLoadingProducts(true);
      try {
        const response = await GetMarketPlaceBuyerProducts({
          category_slug: selectedCategory,
          limit: FEATURED_PRODUCTS_LIMIT,
          page: 1,
        });

        const products = response?.data?.data?.products || [];
        setFeaturedProducts(products);
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setFeaturedProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setIsLoadingTrending(true);
      try {
        const response = await GetTrendingProducts("day");
        const products = response?.data?.data?.products || [];
        setTrendingProducts(products);
      } catch (error: any) {
        console.error('Failed to load trending products:', error);
        setTrendingProducts([]);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleMoodClick = (moodSlug: string) => {
    navigate(`/dashboard/market-place/search?mood_slug=${moodSlug}`);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  const handleExploreCategory = () => {
    if (selectedCategory) {
      navigate('/dashboard/categories', {
        state: { selectedCategory: selectedCategory }
      });
    }
  };

  const handleExploreTrending = () => {
    navigate('/dashboard/market-place/trending-products');
  };

  const handleExploreNewContents = () => {
    navigate('/dashboard/market-place/new-contents');
  };

  return (

    <div
      className={`transition-all duration-300 
        ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"} 
        pt-[20px] px-3 md:px-6`}
    >

      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
        {/* HAPPY (left big one) */}
        <button
          className="col-span-1 row-span-1 relative overflow-hidden rounded-2xl group cursor-pointer
                sm:flex sm:items-start sm:justify-start sm:text-left
                flex items-center justify-center text-center"
          onClick={() => handleMoodClick('happy')}
          aria-label="Browse happy mood products"
        >
          <img
            src={"https://cdn.cness.io/happy.svg"}
            alt="HAPPY"
            loading="lazy"
            className="sm:h-56 sm:w-56 md:h-full md:w-full lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2
            className="
      absolute bottom-4 
      sm:left-4 md:left-6 lg:left-8 text-3xl
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
            HAPPY
          </h2>
        </button>

        {/* Column 2 (Motivated + Calm stacked) */}
        <div className="grid sm:grid-rows-1 md:grid-rows-1 lg:grid gap-4">
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('motivated')}
            aria-label="Browse motivated mood products"
          >
            <img
              src={"https://cdn.cness.io/2%20motivated.svg"}
              alt="Motivated"
              loading="lazy"
              className="md:h-full md:w-full sm:h-44 sm:w-44 lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 
      sm:left-4 text-3xl md:left-6 lg:left-8 
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              Motivated
            </h2>
          </button>
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('calm')}
            aria-label="Browse calm mood products"
          >
            <img
              src={"https://cdn.cness.io/calm.svg"}
              alt="Calm"
              loading="lazy"
              className="sm:h-44 sm:w-44 md:h-full md:w-full lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 text-3xl
      sm:left-4 md:left-6 lg:left-8 
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              CALM
            </h2>
          </button>
        </div>

        {/* Column 3 (Creative tall + Sad small bottom) */}
        <div className="grid sm:grid-rows-1 md:grid-rows-1 lg:grid gap-4">
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('creative')}
            aria-label="Browse creative mood products"
          >
            <img
              src={"https://cdn.cness.io/2%20creative.svg"}
              alt="Creative"
              loading="lazy"
              className="sm:h-44 sm:w-44 md:h-full md:w-full lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 text-3xl
      sm:left-4 md:left-6 lg:left-8 
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              CREATIVE
            </h2>
          </button>
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('sad')}
            aria-label="Browse sad mood products"
          >
            <img
              src={"https://cdn.cness.io/sad.svg"}
              alt="Sad"
              loading="lazy"
              className="sm:h-44 sm:w-44 md:h-full md:w-full lg:h-full lg:w-full lg:h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 text-3xl
      sm:left-4 md:left-6 lg:left-8 
     sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              SAD
            </h2>
          </button>
        </div>

        {/* Column 4 (Spiritual top + Energetic bottom) */}
        <div className="grid grid-rows-2 gap-4">
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('spiritual')}
            aria-label="Browse spiritual mood products"
          >
            <img
              src={"https://cdn.cness.io/Spitirtual.svg"}
              alt="Spiritual"
              loading="lazy"
              className="sm:h-44 sm:w-44 md:h-full md:w-full lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 text-3xl
      sm:left-4 md:left-6 lg:left-8 
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              SPIRITUAL
            </h2>
          </button>
          <button
            className="row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer
                flex items-center justify-center text-center
                sm:block sm:text-left sm:items-start sm:justify-start"
            onClick={() => handleMoodClick('energetic')}
            aria-label="Browse energetic mood products"
          >
            <img
              src={"https://cdn.cness.io/energy.svg"}
              alt="Energetic"
              loading="lazy"
              className="sm:h-44 sm:w-44 md:h-full md:w-full lg:h-full lg:w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <h2
              className="
      absolute bottom-4 text-3xl
      sm:left-4 md:left-6 lg:left-8 
      sm:text-3xl md:text-3xl lg:text-3xl font-bold text-white 
      group-hover:text-black transition-colors">
              ENERGETIC
            </h2>
          </button>
        </div>
      </div>

      <div className="mt-12">
        <MoodSelector moods={moods} />
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 mt-12">
        {/* Trending Products */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
          <img
            src="https://cdn.cness.io/Trendingp.svg"
            alt="Trending Products"
            loading="lazy"
            className="sm:h-[200px] sm:w-[200px] md:h-full md:w-full lg:w-full lg:h-[521px] object-cover"
          />
          {/* Gradient overlay: absolutely positioned on lg+ screens, relative otherwise */}
          <div className="absolute bg-gradient-to-r from-black/50 to-transparent
                    sm:absolute md:absolute lg:absolute inset-0 rounded-2xl md:rounded-3xl" />
          {/* Text container: absolute on lg+, relative on smaller */}
          <div className="absolute text-white left-6 sm:left-8 top-6 sm:top-8 
                    sm:absolute md:absolute lg:absolute max-w-[80%]">
            <h2 className="font-poppins font-bold uppercase leading-tight mb-3 text-2xl sm:text-3xl">
              <div className="flex items-center gap-2 sm:gap-3">
                Trending
                <div className="w-16 sm:w-24 h-0.5 bg-white"></div>
              </div>
              <div className="mt-1 sm:mt-2 text-lg sm:text-xl">Products</div>
            </h2>
            <button
              onClick={handleExploreTrending}
              className="bg-white text-black px-5 py-2.5 sm:px-6 sm:py-3 rounded font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Explore Now
            </button>
          </div>
        </div>

        {/* New Contents */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://cdn.cness.io/new%20arrivals.svg"
            alt="New Contents"
            loading="lazy"
            className="sm:h-[160px] sm:w-[160px] md:h-full md:w-full lg:w-full lg:h-[521px] object-cover"
          />
          {/* Gradient - absolute as you want it overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute left-6 sm:left-8 top-6 sm:top-8 text-white max-w-[80%]">
            <h2 className="font-poppins font-bold uppercase leading-tight mb-3 text-2xl sm:text-3xl">
              <div className="flex items-center gap-2 sm:gap-3">
                New
                <div className="w-16 sm:w-24 h-0.5 bg-white"></div>
              </div>
              <div className="mt-1 sm:mt-2 text-lg sm:text-xl">Contents</div>
            </h2>
            <button
              onClick={handleExploreNewContents}
              className="bg-white text-black px-5 py-2.5 sm:px-6 sm:py-3 rounded font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Explore Now
            </button>
          </div>
        </div>
      </div>



      {/* Featured Products Section */}
      <section className="sm:px-3 md:px-2 lg:px-2 py-10">
        <div className="mb-8">
          <h2 className="font-poppins font-semibold sm:text-2xl md:text-2xl text-3xl text-gray-800 mb-6">Featured products</h2>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:space-x-4">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategorySelect(category.slug)}
                className={`py-4 sm:px-3 md:px-4 lg:px-11 rounded-full border font-medium text-sm transition-colors ${selectedCategory === category.slug
                  ? "border-blue-500 text-blue-500 bg-white"
                  : "border-gray-400 text-gray-400 bg-white hover:border-gray-500"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
<div className="grid gap-6 
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mb-8">
                    {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.product_name,
                      author: product.author,
                      rating: product?.rating?.average,
                      reviews: product?.rating?.total_reviews,
                      currentPrice: product?.discounted_price,
                      originalPrice: product?.price,
                      discount: product.discount_percentage,
                      duration: product.video_details?.duration || product.music_details?.total_duration || "00:00:00",
                      mood_icon: product?.mood_icon,
                      moods: product?.moods || [],
                      image: product?.thumbnail_url || "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                      category: product.category?.name || "",
                      isLike: product?.is_in_wishlist,
                      isCarted: product?.is_in_cart,
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No products found for this category
                </div>
              )}
            </div>

            {/* Explore Button */}
            <div className="flex justify-center">
              <button
                onClick={handleExploreCategory}
                className="flex items-center space-x-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="font-jakarta font-medium">
                  Explore {categories.find(c => c.slug === selectedCategory)?.name || 'products'}
                </span>
                <img
                  src="https://static.codia.ai/image/2025-10-15/xZLgath1fZ.png"
                  alt="Explore"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </>
        )}
      </section>

      {/* Digital Stores Section */}
      <section className="relative w-full h-auto sm:px-2 sm:py-2 md:px-3 md:py-14 lg:px-8 lg:py-16 flex items-center justify-center">
        {/* Background image absolutely positioned */}
        <img
          src={digital}
          alt="Background"
          className="
            absolute inset-0 w-full h-full
            sm:object-contain
            md:rounded-lg
            lg:object-cover
          "
        />

        {/* Gradient overlay (optional, for contrast) */}

        {/* Button centered on top */}
        <div className="flex flex-col items-start space-y-6 mt-32 mr-26 ">

          <Button
            onClick={() => navigate('/dashboard/shops')}
            variant="gradient-primary"
            className="font-['Plus_Jakarta_Sans'] font-medium w-fit h-[42px] px-[19.5px] py-[16px] rounded-[81.26px] text-[14px] leading-[100%] tracking-[0] text-center flex items-center justify-center"
          >
            Visit store
          </Button>
        </div>
      </section>

      <section className="py-16 sm:px-2 md:px-3 lg:px-8 py-16">
        <h2 className="font-poppins font-semibold text-3xl text-center text-black mb-12">Digital stores</h2>

        <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3 w-full
      lg:grid-cols-4 w-full
      xl:grid-cols-4 w-full
      2xl:grid-cols-4  w-full
      gap-5
      sm:gap-6
      md:gap-8
    "
        >
          {isLoadingShops ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {shops.length > 0 ? (
                shops.map((shop) => (
                  <div
                    key={shop?.id}
                    onClick={() => navigate(`/dashboard/shop-detail/${shop.id}`)}
                    className="sm:max-w-[320px] md:max-w-[350px] cursor-pointer h-full"
                  >
                    <ShopCard
                      id={shop?.id}
                      image={shop?.shop_image || 'https://static.codia.ai/image/2025-10-24/COYsFisEy4.png'}
                      name={shop?.shop_name}
                      description={shop?.description || ''}
                      rating={shop?.rating || 0}
                      logo={shop?.shop_logo}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No products found for this category
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/dashboard/shops')}
            className="flex items-center space-x-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
            <span className="font-jakarta font-medium">Visit all stores</span>
            <img src="https://static.codia.ai/image/2025-10-15/4wmOKSRAa7.png" alt="Explore" className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default MarketPlaceNew
