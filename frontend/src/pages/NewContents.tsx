import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetMarketPlaceBuyerProducts } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const NewContents = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    category_slug: searchParams.get("category_slug") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    language: searchParams.get("language") || "",
  });

  // Initial load - reset everything when filters change
  useEffect(() => {
    const fetchNewProducts = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      try {
        const params: any = {
          page: 1,
          limit: 9, // 3 rows × 3 cards = 9 products
          sort_by: "createdAt", // Sort by creation date
          sort_order: "desc", // Newest first
        };

        // Apply filters
        if (filters.category_slug) params.category_slug = filters.category_slug;
        if (filters.min_price) params.min_price = parseFloat(filters.min_price);
        if (filters.max_price) params.max_price = parseFloat(filters.max_price);
        if (filters.language) params.language = filters.language;

        const response = await GetMarketPlaceBuyerProducts(params);
        const productsData = response?.data?.data?.products || [];
        const pagination = response?.data?.data?.pagination || {};

        console.log('NewContents - Full Response:', response?.data?.data);
        console.log('NewContents - Pagination:', pagination);
        console.log('NewContents - Products count:', productsData.length);
        console.log('NewContents - First product sample:', productsData[0]);

        // Check if we have more products
        // If pagination object exists, use it. Otherwise, if we got exactly 9 products, assume there might be more
        const hasMoreProducts = pagination.current_page && pagination.total_pages
          ? pagination.current_page < pagination.total_pages
          : productsData.length === 9; // If we got full page, there might be more

        console.log('NewContents - Has more:', hasMoreProducts);

        setProducts(productsData);
        setHasMore(hasMoreProducts);
      } catch (error: any) {
        showToast({
          message: "Failed to load new products.",
          type: "error",
          duration: 3000,
        });
        setProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewProducts();
  }, [filters]);

  const handleShowMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const params: any = {
        page: nextPage,
        limit: 9, // 3 rows × 3 cards = 9 products
        sort_by: "createdAt",
        sort_order: "desc",
      };

      // Apply filters
      if (filters.category_slug) params.category_slug = filters.category_slug;
      if (filters.min_price) params.min_price = parseFloat(filters.min_price);
      if (filters.max_price) params.max_price = parseFloat(filters.max_price);
      if (filters.language) params.language = filters.language;

      const response = await GetMarketPlaceBuyerProducts(params);
      const productsData = response?.data?.data?.products || [];
      const pagination = response?.data?.data?.pagination || {};

      console.log('NewContents - Load More - Got products:', productsData.length);
      console.log('NewContents - Load More - Pagination:', pagination);

      setProducts((prev) => [...prev, ...productsData]);
      setCurrentPage(nextPage);

      // Check if we have more products
      const hasMoreProducts = pagination.current_page && pagination.total_pages
        ? pagination.current_page < pagination.total_pages
        : productsData.length === 9; // If we got full page, there might be more

      setHasMore(hasMoreProducts);
    } catch (error: any) {
      showToast({
        message: "Failed to load more products.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category_slug) params.set("category_slug", filters.category_slug);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.language) params.set("language", filters.language);

    setSearchParams(params);
  }, [filters]);

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
    navigate("/dashboard/market-place/new-contents");
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
        {/* ✨ Header Section */}
        <div className="max-w-[1800px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-2xl px-6 py-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-800">New Contents</h1>
              </div>
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                Latest Arrivals
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
                      Latest Products
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {products.length} product{products.length !== 1 ? "s" : ""} found • Sorted by newest first
                    </p>
                  </div>

                  {products.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={{
                              id: product.id,
                              title: product.product_name || product.product_title || product.title || "Untitled",
                              author: product.author || product.seller?.shop_name || product.seller?.shop?.shop_name || product.seller?.owner_full_name || "Unknown",
                              rating: parseFloat(product?.rating?.average || product?.average_rating || "0"),
                              reviews: product?.rating?.total_reviews || product?.total_reviews || 0,
                              currentPrice: product?.discounted_price || product?.final_price,
                              originalPrice: product?.price,
                              discount: parseFloat(product.discount_percentage || "0"),
                              duration: product.duration || product.video_details?.duration || product.music_details?.total_duration || "00:00:00",
                              moods: product?.moods || product?.tags || [],
                              image:
                                product.thumbnail_url ||
                                "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                              category: product.category?.name || product.product_category?.name || "",
                              isLike: product?.is_in_wishlist || product?.is_wishlisted || false,
                              isCarted: product?.is_in_cart || false,
                            }}
                          />
                        ))}
                      </div>

                      {/* Show More Button */}
                      {hasMore && (
                        <div className="flex justify-center mt-10">
                          <button
                            onClick={handleShowMore}
                            disabled={isLoadingMore}
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingMore ? "Loading..." : "Show More Products"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <div className="text-gray-400 mb-4">
                        <Sparkles className="w-20 h-20 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No new products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or check back later for new arrivals
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

export default NewContents;
