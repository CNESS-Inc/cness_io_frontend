import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown, Filter as FilterIcon } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import filter from "../assets/filter.svg";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetProductWishlist } from "../Common/ServerAPI";

const Wishlist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sorting
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Top Rated");

  const options = [
    "Top Rated",
    "Newest Arrival",
    "Most Popular",
    "Price : High to Low",
    "Price : Low to High",
  ];

  const fetchWishlistProducts = async () => {
    setIsLoading(true);
    try {
      const response = await GetProductWishlist();
      const wishlistData = response?.data?.data?.wishlist || [];
      setProducts(wishlistData);
    } catch (error: any) {
      showToast({
        message: "Failed to load wishlist",
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
  }, []);

  // Handle Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSelection = () => {
    setSearchQuery("");
  };

  // Filter Products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
      if (!searchQuery) return true;
      const lower = searchQuery.toLowerCase();
      const title = product.product?.product_title || "";
      return title.toLowerCase().includes(lower);
    })
    : [];

  // const sortedProducts = [...filteredProducts].sort((a, b) => {
  //   const aProduct = a.product;
  //   const bProduct = b.product;

  //   switch (selected) {
  //     case "Top Rated":
  //       return (parseFloat(bProduct?.rating || "0") - parseFloat(aProduct?.rating || "0"));
  //     case "Price : High to Low":
  //       return (parseFloat(bProduct?.final_price || "0") - parseFloat(aProduct?.final_price || "0"));
  //     case "Price : Low to High":
  //       return (parseFloat(aProduct?.final_price || "0") - parseFloat(bProduct?.final_price || "0"));
  //     case "Newest Arrival":
  //       return new Date(bProduct?.createdAt || 0).getTime() - new Date(aProduct?.createdAt || 0).getTime();
  //     default:
  //       return 0;
  //   }
  // });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aProduct = a.product || {}; 
    const bProduct = b.product || {}; 
  
    switch (selected) {
      case "Top Rated":
        const aRating = parseFloat(aProduct?.rating || "0");
        const bRating = parseFloat(bProduct?.rating || "0");
        return bRating - aRating;  
      case "Price : High to Low":
        const aPrice = parseFloat(aProduct?.final_price || "0");
        const bPrice = parseFloat(bProduct?.final_price || "0");
        return bPrice - aPrice; 
      case "Price : Low to High":
        const aLowPrice = parseFloat(aProduct?.final_price || "0");
        const bLowPrice = parseFloat(bProduct?.final_price || "0");
        return aLowPrice - bLowPrice;  
      case "Newest Arrival":
        const aCreatedAt = new Date(aProduct?.createdAt || 0).getTime();
        const bCreatedAt = new Date(bProduct?.createdAt || 0).getTime();
        return bCreatedAt - aCreatedAt;  
      default:
        return 0;  // No sorting
    }
  });
  

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Refresh wishlist after removing item
  const handleWishlistUpdate = () => {
    fetchWishlistProducts();
  };

  return (
    <>
      <h2
        className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6 mt-5">
        My Wishlist
      </h2>

      {/* 🔍 Search + Sort Section */}
      <div className="w-full max-w-[2000px] mx-auto flex items-start justify-between px-5 mt-8 gap-6">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-4 max-w-[1200px]">
            {/* Search Bar */}
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm flex-[0.8]">
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

            {/* Sort Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#7077FE] rounded-full shadow-sm text-[#7077FE] font-medium text-sm md:text-base hover:shadow-md transition-all min-w-[140px] md:min-w-[180px]"
              >
                <div className="flex items-center gap-2">
                  <img src={filter} alt="filter" className="w-5 h-5" />
                  <span className="truncate">{selected}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <div className="absolute top-full mt-2 w-60 bg-white border border-[#7077FE] rounded-2xl shadow-lg z-50 p-4 space-y-3">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`block w-full text-left font-poppins font-normal text-[16px] leading-[100%] px-2 py-1 rounded-lg transition-colors ${selected === option
                        ? "text-[#7077FE] font-semibold"
                        : "text-gray-700 hover:text-[#7077FE]"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Main Section */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {sortedProducts?.length > 0 ? (
                sortedProducts?.map((product) => {
                  console.log('profbgnduct', product);
                  return (
                    <ProductCard
                      key={product.wishlist_id}
                      product={{
                        id: product.product_id,
                        title: product.product_name,
                        author: product.seller?.shop_name || "Unknown",
                        rating: parseFloat(product.rating) || 0,
                        reviews: product.total_reviews || 0,
                        currentPrice: product?.discounted_price,
                        originalPrice: product?.price,
                        discount: product?.discount_percentage,
                        duration:
                          product.video_details?.duration ||
                          product.music_details?.total_duration ||
                          "00:00:00",
                        mood: `${product.mood?.icon || ""} ${product.mood?.name || ""}`,
                        image:
                          product.thumbnail_url ||
                          "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                        category: product.category?.name || "",
                        isInWishlist: true,
                      }}
                      isLiked={true}
                      onWishlistUpdate={handleWishlistUpdate}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Start adding products you love!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🧰 Filter Sidebar (RIGHT) */}
        <div className="hidden md:block w-[300px] flex-shrink-0 -mt-25 px-10">
          <Filter filters={{}} onFilterChange={() => { }} />
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
            <Filter filters={{}} onFilterChange={() => { }} />
          </div>
        </div>
      )}

    </>
  );
};

export default Wishlist;
