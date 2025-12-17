import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown, Filter as FilterIcon } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import filter from "../assets/filter.svg";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetProductWishlist } from "../Common/ServerAPI";
import { useCartWishlist } from "../components/MarketPlace/context/CartWishlistContext";

const Wishlist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { updateWishlistCount, decrementWishlist } = useCartWishlist();

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState<any>({
    min_price: "",
    max_price: "",
    language: "",
    min_duration: "",
    max_duration: "",
    min_rating: "",
    sort_by: "top_rated",
    category_slug: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Top Rated", value: "top_rated" },
    { label: "Newest Arrival", value: "new_arrivals" },
    { label: "Most Popular", value: "most_popular" },
    { label: "Price : High to Low", value: "price_high_to_low" },
    { label: "Price : Low to High", value: "price_low_to_high" },
  ];

  // Get selected option label
  const getSelectedLabel = () => {
    const option = options.find(opt => opt.value === filters.sort_by);
    return option ? option.label : "Top Rated";
  };

  const fetchWishlistProducts = async () => {
    setIsLoading(true);
    try {
      const apiParams: any = {
        page: 1,
        limit: 100,
      };
  
      // Add sort_by (required, always send)
      if (filters.sort_by) {
        apiParams.sort_by = filters.sort_by;
      }
  
      // Add language filter
      if (filters.language) {
        apiParams.language = filters.language;
      }
  
      // Add duration filters
      if (filters.min_duration) {
        apiParams.min_duration = filters.min_duration;
      }
      if (filters.max_duration) {
        apiParams.max_duration = filters.max_duration;
      }
  
      // Add rating filter (min_rating not just rating)
      if (filters.min_rating) {
        apiParams.min_rating = parseFloat(filters.min_rating);
      }
  
      // Add price filters
      if (filters.min_price) {
        apiParams.min_price = parseFloat(filters.min_price);
      }
      if (filters.max_price) {
        apiParams.max_price = parseFloat(filters.max_price);
      }
  
      // Add category filter
      if (filters.category_slug) {
        apiParams.category_slug = filters.category_slug;
      }
  
      console.log("🔍 API Params:", apiParams);
  
      const response = await GetProductWishlist(apiParams);
      const wishlistData = response?.data?.data?.wishlist || [];
      setProducts(wishlistData);

      await updateWishlistCount();
    } catch (error: any) {
      console.error("API Error:", error);
      showToast({
        message: error?.response?.data?.message || "Failed to load wishlist",
        type: "error",
        duration: 3000,
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
  }, [searchQuery, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSelection = () => {
    setSearchQuery("");
  };

  const handleSelect = (value: string) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      sort_by: value,
    }));
    setIsOpen(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleWishlistUpdate = () => {
    decrementWishlist();
    fetchWishlistProducts();
  };

  return (
    <>
      <h2 className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6 mt-5">
        My Wishlist
      </h2>

     <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between px-5 mt-8 gap-4 sm:gap-6">
      {/* Search Bar */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-3 shadow-sm min-w-[200px] flex-1">
        {searchQuery && (
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-[#9747FF] mr-2">
            {searchQuery}
            <button
              onClick={clearSelection}
              className="ml-2 text-[#9747FF] hover:text-[#9747FF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent outline-none text-[#9747FF] text-sm placeholder-[#9747FF]"
        />
        <Search className="w-5 h-5 text-[#9747FF] ml-3" />
      </div>

  {/* Filter Dropdown */}
  <div className="relative flex-1 min-w-[140px] sm:min-w-[180px] mt-4 sm:mt-0">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-[#7077FE] rounded-full shadow-sm text-[#7077FE] font-medium text-sm md:text-base hover:shadow-md transition-all sm:w-auto w-full"
    >
      <div className="flex items-center gap-2">
        <img src={filter} alt="filter" className="w-5 h-5" />
        <span className="truncate">{getSelectedLabel()}</span>
      </div>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="absolute top-full mt-2 w-60 bg-white border border-[#7077FE] rounded-2xl shadow-lg z-50 p-4 space-y-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option.value)}
            className={`block w-full text-left font-poppins font-normal text-[16px] leading-[100%] px-2 py-1 rounded-lg transition-colors ${
              filters.sort_by === option.value
                ? "text-[#7077FE] font-semibold"
                : "text-gray-700 hover:text-[#7077FE]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
</div>



      <div className="flex w-full mx-auto px-5 py-10 gap-8">
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6"
            onClick={() => setShowMobileFilter(true)}
          >
            <FilterIcon className="w-5 h-5" /> Filters
          </button>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {products?.length > 0 ? (
                products?.map((product) => {
                  return (
                    <ProductCard
                      key={product.wishlist_id}
                      product={{
                        id: product.product_id,
                        title: product.product_name,
                        author: product.author_name || "Unknown",
                        rating: product?.rating?.average,
                        reviews: product?.rating?.total_reviews,
                        currentPrice: product?.discounted_price,
                        originalPrice: product?.price,
                        discount: product?.discount_percentage,
                        duration:
                          product.video_details?.duration ||
                          product.music_details?.total_duration ||
                          "00:00:00",
                        mood_icon: product?.mood_icon,
                       moods: product?.moods || [],
                        image:
                          product.thumbnail_url ||
                          "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                        category: product.category?.name || "",
                        isLike: true,
                        isCarted: product?.is_in_cart,
                      }}
                      onWishlistUpdate={handleWishlistUpdate}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 text-lg">
                    {searchQuery || Object.values(filters).some(v => v && v !== 'top_rated')
                      ? "No products match your filters"
                      : "Your wishlist is empty"}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchQuery || Object.values(filters).some(v => v && v !== 'top_rated')
                      ? "Try adjusting your filters"
                      : "Start adding products you love!"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🧰 Filter Sidebar (RIGHT) */}
        <div className="hidden md:block w-[300px] flex-shrink-0 -mt-25 px-10">
          <Filter filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* 📱 Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-[85%] sm:w-[400px] h-full p-6 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setShowMobileFilter(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <Filter filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;