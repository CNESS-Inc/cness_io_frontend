import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TrendingUp, X } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetTrendingProducts } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const TrendingProducts = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productsPerPage] = useState(12);
  const [currentDisplayCount, setCurrentDisplayCount] = useState(12);
  const [timeRange, setTimeRange] = useState<"day" | "week">(
    (searchParams.get("timeRange") as "day" | "week") || "day"
  );

  const [filters, setFilters] = useState({
    category_slug: searchParams.get("category_slug") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setIsLoading(true);
      setCurrentDisplayCount(productsPerPage); // Reset display count
      try {
        const response = await GetTrendingProducts(timeRange);
        let productsData = response?.data?.data?.products || [];

        // Apply client-side filtering based on filters
        if (filters.category_slug) {
          productsData = productsData.filter(
            (p: any) => p.category?.slug === filters.category_slug
          );
        }
        if (filters.min_price) {
          productsData = productsData.filter(
            (p: any) => p.final_price >= parseFloat(filters.min_price)
          );
        }
        if (filters.max_price) {
          productsData = productsData.filter(
            (p: any) => p.final_price <= parseFloat(filters.max_price)
          );
        }
        if (filters.language) {
          productsData = productsData.filter(
            (p: any) => p.language === filters.language
          );
        }

        console.log('TrendingProducts - Total products:', productsData.length);
        console.log('TrendingProducts - Initial display count:', productsPerPage);

        setAllProducts(productsData);
      } catch (error: any) {
        showToast({
          message: "Failed to load trending products.",
          type: "error",
          duration: 3000,
        });
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [timeRange, filters]);

  // Update displayed products when allProducts or currentDisplayCount changes
  useEffect(() => {
    setDisplayedProducts(allProducts.slice(0, currentDisplayCount));
    console.log('TrendingProducts - Displayed:', currentDisplayCount, 'of', allProducts.length);
  }, [allProducts, currentDisplayCount]);

  const handleShowMore = () => {
    setCurrentDisplayCount((prev) => prev + productsPerPage);
  };

  const hasMoreProducts = currentDisplayCount < allProducts.length;
  console.log('TrendingProducts - Has more?', hasMoreProducts, `(${currentDisplayCount} < ${allProducts.length})`);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("timeRange", timeRange);
    if (filters.category_slug) params.set("category_slug", filters.category_slug);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.language) params.set("language", filters.language);

    setSearchParams(params);
  }, [timeRange, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      category_slug: "",
      min_price: "",
      max_price: "",
      language: "",
    });
    setTimeRange("day");
    navigate("/dashboard/market-place/trending-products");
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
      } pt-[20px] px-6`}
    >
      <div
        className={`transition-all duration-300 ${
          isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[20px] px-6`}
      >
        {/* 🔥 Header Section */}
        <div className="max-w-[1800px] mx-auto">
          {/* Time Range Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-2xl px-6 py-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-800">Trending Products</h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setTimeRange("day")}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    timeRange === "day"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    timeRange === "week"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            {filters.category_slug && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm">
                <span>Category: {filters.category_slug}</span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters, category_slug: "" };
                    setFilters(newFilters);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {filters.language && (
              <div className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm">
                <span>Language: {filters.language}</span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters, language: "" };
                    setFilters(newFilters);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {(filters.min_price || filters.max_price) && (
              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm">
                <span>
                  Price: ${filters.min_price || "0"} - ${filters.max_price || "∞"}
                </span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters, min_price: "", max_price: "" };
                    setFilters(newFilters);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {(filters.category_slug || filters.min_price || filters.max_price || filters.language) && (
              <button
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* 📦 Main Section */}
          <div className="flex gap-6">
            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {timeRange === "day" ? "Trending Today" : "Trending This Week"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Showing {displayedProducts.length} of {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {displayedProducts.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={{
                            id: product.id,
                            title: product.product_title,
                            author: product.seller?.owner_full_name || "Unknown",
                            rating: parseFloat(product?.average_rating || "0"),
                            reviews: product?.total_reviews || 0,
                            currentPrice: product?.final_price,
                            originalPrice: product?.price,
                            discount: product.discount_percentage,
                            duration: "00:00:00",
                            moods: product?.tags || [],
                            image:
                              product.thumbnail_url ||
                              "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                            category: product.category?.name || "",
                            isLike: product?.is_wishlisted,
                            isCarted: false,
                          }}
                        />
                      ))}
                    </div>

                    {/* Show More Button */}
                    {hasMoreProducts && (
                      <div className="flex justify-center mt-10">
                        <button
                          onClick={handleShowMore}
                          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                          Show More Products
                        </button>
                      </div>
                    )}
                  </>
                  ) : (
                    <div className="text-center py-20">
                      <div className="text-gray-400 mb-4">
                        <TrendingUp className="w-20 h-20 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No trending products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or check back later
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Filter Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Filter filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
