import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Filter as FilterIcon } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import { GetMarketPlaceBuyerCategories, GetMarketPlaceBuyerProducts } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Category = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const location = useLocation();
  const { showToast } = useToast();

  // Get category from URL const stateCategorySlug = location.state?.selectedCategory;
  const stateCategorySlug = location.state?.selectedCategory;
  const initialCategory = stateCategorySlug || '';

  // ✅ Active Category State
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  console.log('products', products)
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    language: "",
    duration: "",
    rating: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetMarketPlaceBuyerCategories();
        const cats = response?.data?.data || [];
        setCategories(cats);

        if (stateCategorySlug) {
          setActiveCategory(stateCategorySlug);
        } else if (cats.length > 0) {
          setActiveCategory(cats[0].slug);
        }
      } catch (error: any) {
        showToast({
          message: "Failed to load categories.",
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchCategories();
  }, [stateCategorySlug]);

  // Fetch products when category or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) return;

      setIsLoading(true);
      try {
        const params: any = {
          category_slug: activeCategory,
          page: 1,
          limit: 100,
        };

        // Apply filters
        if (filters.min_price) params.min_price = parseFloat(filters.min_price);
        if (filters.max_price) params.max_price = parseFloat(filters.max_price);
        if (filters.language) params.language = filters.language;
        // Duration and rating filters would need backend support

        const response = await GetMarketPlaceBuyerProducts(params);
        const productsData = response?.data?.data?.products || [];
        setProducts(productsData);
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
  }, [activeCategory, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div
      className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[10px] px-6`}
    >
      <h2 className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-8">
        Shop by Categories
      </h2>

      {/* 🔹 Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 px-0">
        {categories.map((category) => {
          // Count products for this category (you can get this from API if available)
          const categoryProductCount = category.product_count || 0;

          return (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`flex items-center gap-3 px-8 py-3 h-[54px] rounded-full border font-medium text-sm transition-all duration-200 ${activeCategory === category.slug
                  ? "border-[#7077FE] text-[#7077FE] bg-white shadow-sm"
                  : "border-[#A7A6A6] text-[#A7A6A6] bg-white hover:border-[#7077FE]/60"
                }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === category.slug
                    ? "bg-[#7077FE] text-white"
                    : "bg-[#A7A6A6] text-white"
                  }`}
              >
                {categoryProductCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 📦 Main Section */}
<div className="flex w-full mx-auto px-1 gap-8 relative">
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6"
            onClick={() => setShowMobileFilter(true)}
          >
            <FilterIcon className="w-5 h-5" /> Filters
          </button>

          {/* 🧩 Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-3
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.product_title,
                      author: product.seller?.shop_name || product.author ||"Unknown",
                      rating: product?.rating?.average,
                      reviews: product?.rating?.total_reviews,
                      currentPrice: product?.discounted_price,
                      originalPrice: product?.price,
                      discount: product.discount_percentage,
                       duration: product.duration || "00:00:00",

                      mood: `${product?.mood_icon || ""} ${product?.mood_name || ""}`,
                      image:
                        product.thumbnail_url ||
                        "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                      category: product.category?.name || "",
                      isLike: product?.is_in_wishlist,
                      isCarted: product?.is_in_cart,
                    }}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No results found in "{categories.find(c => c.slug === activeCategory)?.name || activeCategory}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🧰 Right Sidebar Filter */}
{/* 🧰 Right Sidebar Filter (Desktop Fixed) */}
<div
  className="
    hidden md:block w-[260px] 
    sticky 
    top-[90px]        /* Default */
    md:top-[70px]     /* Tablet */
    lg:top-[30px]     /* Laptop */
    xl:top-[30px]     /* Large screen */
    -mt-[10px]        /* Pull slightly upward */
    h-fit
  "
>  <Filter filters={filters} onFilterChange={handleFilterChange} />
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
            <Filter 
            filters={filters} 
            onFilterChange={handleFilterChange} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;