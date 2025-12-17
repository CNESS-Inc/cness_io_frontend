import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetMarketPlaceBuyerProducts } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Pagination from "../components/MarketPlace/Pagination";

const MPSearch = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedMood, setSelectedMood] = useState(searchParams.get("mood_slug") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category_slug: searchParams.get("category_slug") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    language: searchParams.get("language") || "",
    sort_by: searchParams.get("sort_by") || "createdAt",
    sort_order: searchParams.get("sort_order") || "desc",
    creator_search: searchParams.get("creator_search") || "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: 12,
        };

        // Combine searchQuery and creator_search into single 'search' param
        const combinedSearch = [searchQuery, filters.creator_search].filter(Boolean).join(" ");
        if (combinedSearch) params.search = combinedSearch;

        if (selectedMood) params.mood_slug = selectedMood;
        if (filters.category_slug) params.category_slug = filters.category_slug;
        if (filters.min_price) params.min_price = parseFloat(filters.min_price);
        if (filters.max_price) params.max_price = parseFloat(filters.max_price);
        if (filters.language) params.language = filters.language;
        if (filters.sort_by) params.sort_by = filters.sort_by;
        if (filters.sort_order) params.sort_order = filters.sort_order;

        const response = await GetMarketPlaceBuyerProducts(params);
        const productsData = response?.data?.data?.products || [];
        const pagination = response?.data?.data?.pagination || {};

        setProducts(productsData);
        setTotalPages(pagination.total_pages || 1);
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedMood, filters, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedMood) params.set("mood_slug", selectedMood);
    if (filters.category_slug) params.set("category_slug", filters.category_slug);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.language) params.set("language", filters.language);
    if (filters.creator_search) params.set("creator_search", filters.creator_search);
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    if (filters.sort_order) params.set("sort_order", filters.sort_order);

    setSearchParams(params);
  }, [searchQuery, selectedMood, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const clearMood = () => {
    setSelectedMood("");
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedMood("");
    setFilters({
      category_slug: "",
      min_price: "",
      max_price: "",
      language: "",
      creator_search: "",
      sort_by: "createdAt",
      sort_order: "desc",
    });
    setCurrentPage(1);
    navigate("/dashboard/market-place/search");
  };

  return (
    <div
      className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[20px] px-6`}
    >
      <div
        className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
          } pt-[20px] px-6`}
      >
        {/* 🔍 Search + Sort Section */}
        <div className="max-w-[1800px] mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full bg-white border border-gray-300 rounded-full px-6 py-4 space-x-3"
            >
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-base placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                )}
              </div>
              <button type="submit" className="flex-shrink-0">
                <Search className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </form>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 items-center">
            {searchQuery && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm">
                <span>Search: "{searchQuery}"</span>
                <button onClick={clearSearch}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedMood && (
              <div className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm">
                <span>Mood: {selectedMood}</span>
                <button onClick={clearMood}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {filters.creator_search && (
              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm">
                <span>Creator: "{filters.creator_search}"</span>
                <button onClick={() => {
                  const newFilters = { ...filters, creator_search: "" };
                  setFilters(newFilters);
                  setCurrentPage(1);
                }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {(searchQuery || selectedMood || filters.category_slug || filters.min_price || filters.max_price || filters.language || filters.creator_search) && (
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
                      {searchQuery
                        ? `Search results for "${searchQuery}"`
                        : selectedMood
                          ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} mood products`
                          : "All products"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {products.length} product{products.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  {products.length > 0 ? (
                    <>
<div className="grid gap-3
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                              {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={{
                              id: product.id,
                              title: product.product_title,
                              author: product.seller?.shop_name || "Unknown",
                              rating: product?.rating?.average,
                              reviews: product?.rating?.total_reviews,
                              currentPrice: product?.discounted_price,
                              originalPrice: product?.price,
                              discount: product.discount_percentage,
                              duration:
                                product.video_details?.duration ||
                                product.music_details?.total_duration ||
                                "00:00:00",
                              moods: product?.moods || [],
                              image:
                                product.thumbnail_url ||
                                "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                              category: product.product_category?.name || "",
                              isLike: product?.is_in_wishlist,
                              isCarted: product?.is_in_cart,
                            }}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <div className="text-gray-400 mb-4">
                        <Search className="w-20 h-20 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your search or filters
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

export default MPSearch;