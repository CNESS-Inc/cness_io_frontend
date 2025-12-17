import React, { useEffect, useState } from "react";
// import { FiSearch } from "react-icons/fi";
import { GetMarketPlaceBuyerCategories, GetMarketPlaceBuyerFilters } from "../../Common/ServerAPI";
import { useLocation } from "react-router-dom";

interface FilterProps {
  filters: {
    category_slug?: string;
    min_price?: string;
    max_price?: string;
    language?: string;
    min_duration?: number;
    max_duration?: number;
    min_rating?: number;
    max_rating?: number;
    order_time?: string;
    sort_by?: string;
    creator_search?: string;
  };
  onFilterChange: (filters: any) => void;
  customFilterOptions?: any; // Pass custom filter options from parent
  filterConfig?: {
    showCategory?: boolean;
    showPrice?: boolean;
    showLanguage?: boolean;
    showDuration?: boolean;
    showRating?: boolean;
    showOrderTime?: boolean;
    showCreatorSearch?: boolean;
  };
}

const FilterSidebar: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  customFilterOptions = null,
  filterConfig = {
    showCategory: true,
    showPrice: true,
    showLanguage: true,
    showDuration: true,
    showRating: true,
    showOrderTime: false,
    showCreatorSearch: true,
  }
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>({
    languages: [],
    duration_ranges: [],
    rating_range: { min: 0, max: 5, step: 0.5 },
    price_ranges: [],
    order_time_options: [],
    price_min: 0,
    price_max: 1000,
  });
  const [localFilters, setLocalFilters] = useState(filters);

  const isCategoriesPage = location.pathname === '/dashboard/categories';

  useEffect(() => {
    if (customFilterOptions) {
      setFilterOptions(customFilterOptions);
      if (customFilterOptions.categories) {
        setCategories(customFilterOptions.categories);
      }
    } else {
      fetchDefaultFilters();
    }
  }, [customFilterOptions]);

  const fetchDefaultFilters = async () => {
    try {
      // Fetch categories
      const categoryResponse = await GetMarketPlaceBuyerCategories();
      setCategories(categoryResponse?.data?.data || []);

      // Fetch filter options
      const filterResponse = await GetMarketPlaceBuyerFilters();
      setFilterOptions(filterResponse?.data?.data || {
        languages: [],
        duration_ranges: [],
        rating_ranges: [],
        price_ranges: [],
        price_min: 0,
        price_max: 1000,
      });
    } catch (error) {
      console.error("Failed to load filters");
    }
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Check if any filters are applied
  const hasActiveFilters = () => {
    return Object.keys(localFilters).some(key => {
      const value = localFilters[key as keyof typeof localFilters];
      return value !== undefined && value !== null && value !== '' && 
             !(key === 'min_price' && value === filterOptions.price_min?.toString()) &&
             !(key === 'max_price' && value === filterOptions.price_max?.toString());
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      category_slug: undefined,
      min_price: undefined,
      max_price: undefined,
      language: undefined,
      min_duration: undefined,
      max_duration: undefined,
      min_rating: undefined,
      max_rating: undefined,
      order_time: undefined,
      sort_by: undefined,
      creator_search: undefined,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleCategoryToggle = (categorySlug: string) => {
    const newFilters = {
      ...localFilters,
      category_slug: localFilters.category_slug === categorySlug ? "" : categorySlug,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleOrderTimeToggle = (orderTime: string) => {
    const newFilters = {
      ...localFilters,
      order_time: localFilters.order_time === orderTime ? "" : orderTime,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (field: 'min_price' | 'max_price', value: string) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(newFilters);
  };

  const handlePriceBlur = () => {
    onFilterChange(localFilters);
  };

  const handleLanguageToggle = (language: string) => {
    const newFilters = {
      ...localFilters,
      language: localFilters.language === language ? "" : language,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: number) => {
    const newFilters = {
      ...localFilters,
      min_rating: localFilters.min_rating === value ? undefined : value,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // const handleCreatorSearchChange = (value: string) => {
  //   const newFilters = {
  //     ...localFilters,
  //     creator_search: value,
  //   };
  //   setLocalFilters(newFilters);
  // };

  // const handleCreatorSearchBlur = () => {
  //   onFilterChange(localFilters);
  // };

  return (
    <>
      {/* 📱 Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#7077FE] text-white rounded-lg text-sm font-semibold shadow hover:bg-[#5a5fe0] transition"
        >
          Show Filters ⚙️
        </button>
      </div>

      {/* 🩶 Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      {/* 🧭 Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 
          h-full md:h-auto
          w-[80%] sm:w-[300px] md:w-[250px]
          bg-white border border-gray-200 rounded-none md:rounded-xl
          shadow-lg md:shadow-sm
          p-5 md:p-6
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ❌ Close Button (Mobile Only) */}
        <div className="md:hidden flex justify-end mb-3">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✖
          </button>
        </div>

        {/* Header with Title and Clear Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Filters</h3>
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="border-t border-gray-200 mb-5"></div>

        {/* 📂 Category */}
        {filterConfig.showCategory && !isCategoriesPage && categories.length > 0 && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Category</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {categories.map((category) => (
                <label
                  key={category.slug}
                  className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.category_slug === category.slug}
                    onChange={() => handleCategoryToggle(category.slug)}
                    className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 💲 Price */}
        {filterConfig.showPrice && (
        <div className="space-y-2 mb-8">
          <h3 className="text-[16px] font-[poppins] font-semibold">Price</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder={`$${filterOptions.price_min || 0}`}
              value={localFilters.min_price || ""}
              onChange={(e) => handlePriceChange('min_price', e.target.value)}
              onBlur={handlePriceBlur}
              min={filterOptions.price_min}
              max={filterOptions.price_max}
              className="w-[90px] px-3 py-2 border rounded-lg text-sm font-semibold font-[poppins] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder={`$${filterOptions.price_max || 1000}`}
              value={localFilters.max_price || ""}
              onChange={(e) => handlePriceChange('max_price', e.target.value)}
              onBlur={handlePriceBlur}
              min={filterOptions.price_min}
              max={filterOptions.price_max}
              className="w-[90px] px-3 py-2 border rounded-lg text-sm font-semibold font-[poppins] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
          </div>

          {filterOptions.price_ranges && filterOptions.price_ranges.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {filterOptions.price_ranges.map((range: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newFilters = {
                        ...localFilters,
                        min_price: range.min.toString(),
                        max_price: range.max.toString(),
                      };
                      setLocalFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-[#7077FE] hover:text-white rounded transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* 🌍 Language */}
        {filterConfig.showLanguage && filterOptions.languages && filterOptions.languages.length > 0 && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Language</h3>
            {filterOptions.languages.map((language: any) => (
              <label
                key={language.value}
                className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.language === language.value}
                  onChange={() => handleLanguageToggle(language.value)}
                  className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                />
                <span>{language.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* 🕒 Order Time Filter (for Library) */}
        {filterConfig.showOrderTime && filterOptions.order_time_options && filterOptions.order_time_options.length > 0 && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Ordered Time</h3>
            {filterOptions.order_time_options.map((option: any) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.order_time === option.value}
                  onChange={() => handleOrderTimeToggle(option.value)}
                  className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* ⭐ Ratings */}
        {filterConfig.showRating && filterOptions.rating_range && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Ratings</h3>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.min_rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                />
                <span className="flex items-center gap-1">
                  {rating}
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-500">& above</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {/* 🧑‍🎨 Creator Search */}
        {/* {filterConfig.showCreatorSearch && (
          <div className="mt-8 relative">
            <h3 className="text-[16px] font-[poppins] font-semibold mb-3">
              Creators / Publisher
            </h3>
            <input
              type="text"
              placeholder="Search"
              value={localFilters.creator_search || ""}
              onChange={(e) => handleCreatorSearchChange(e.target.value)}
              onBlur={handleCreatorSearchBlur}
              className="w-full pl-10 py-2 font-[poppins] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
            <FiSearch className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400" />
          </div>
        )} */}
      </aside >
    </>
  );
};

export default FilterSidebar;