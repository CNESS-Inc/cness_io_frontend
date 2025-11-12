import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
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
    sort_by?: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterProps> = ({ filters, onFilterChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>({
    languages: [],
    duration_ranges: [],
    rating_ranges: [],
    price_ranges: [],
    price_min: 0,
    price_max: 1000,
  });
  const [localFilters, setLocalFilters] = useState(filters);

  const isCategoriesPage = location.pathname === '/dashboard/categories';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetMarketPlaceBuyerCategories();
        setCategories(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await GetMarketPlaceBuyerFilters();
        setFilterOptions(response?.data?.data || {
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

    fetchFilters();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryToggle = (categorySlug: string) => {
    const newFilters = {
      ...localFilters,
      category_slug: localFilters.category_slug === categorySlug ? "" : categorySlug,
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

  const handleDurationToggle = (durationRange: any) => {
    const isDurationSelected =
      localFilters.min_duration === durationRange.min &&
      localFilters.max_duration === durationRange.max;

    const newFilters = isDurationSelected
      ? { ...localFilters, min_duration: undefined, max_duration: undefined }
      : { ...localFilters, min_duration: durationRange.min, max_duration: durationRange.max };

    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingToggle = (ratingRange: any) => {
    const isRatingSelected =
      localFilters.min_rating === ratingRange.min &&
      localFilters.max_rating === ratingRange.max;

    const newFilters = isRatingSelected
      ? { ...localFilters, min_rating: undefined, max_rating: undefined }
      : { ...localFilters, min_rating: ratingRange.min, max_rating: ratingRange.max };

    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isDurationSelected = (durationRange: any) => {
    return localFilters.min_duration === durationRange.min &&
      localFilters.max_duration === durationRange.max;
  };

  const isRatingSelected = (ratingRange: any) => {
    return localFilters.min_rating === ratingRange.min &&
      localFilters.max_rating === ratingRange.max;
  };

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

        {/* 🏷️ Filters Title */}
        <div>
          <h3 className="text-lg font-bold mb-4">Filters</h3>
          <div className="border-t border-gray-200 mb-5"></div>
        </div>

        {/* 📂 Category */}
        {!isCategoriesPage && (
          < div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Category</h3>
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
        )}

        {/* 💲 Price */}
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

        {/* 🌍 Language */}
        {filterOptions.languages && filterOptions.languages.length > 0 && (
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

        {/* ⏱️ Duration */}
        {filterOptions.duration_ranges && filterOptions.duration_ranges.length > 0 && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Duration</h3>
            {filterOptions.duration_ranges.map((duration: any, index: number) => (
              <label
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isDurationSelected(duration)}
                  onChange={() => handleDurationToggle(duration)}
                  className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                />
                <span>{duration.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* ⭐ Ratings */}
        {filterOptions.rating_ranges && filterOptions.rating_ranges.length > 0 && (
          <div className="space-y-2 mb-8">
            <h3 className="text-[16px] font-semibold">Ratings</h3>
            {filterOptions.rating_ranges.map((rating: any, index: number) => (
              <label
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isRatingSelected(rating)}
                  onChange={() => handleRatingToggle(rating)}
                  className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                />
                <span>{rating.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* 🧑‍🎨 Creator Search */}
        <div className="mt-8 relative">
          <h3 className="text-[16px] font-[poppins] font-semibold mb-3">
            Creators / Publisher
          </h3>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 py-2 font-[poppins] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
          />
          <FiSearch className="absolute right-3 -mt-4 transform -translate-y-1/2 text-gray-400" />
        </div>
      </aside >
    </>
  );
};

export default FilterSidebar;

/* 💡 Reusable Filter Group Component */
// const FilterGroup = ({
//   title,
//   items,
// }: {
//   title: string;
//   items: string[];
// }) => (
//   <div className="space-y-2 mb-8">
//     <h3 className="text-[16px] font-semibold">{title}</h3>
//     {items.map((item) => (
//       <label
//         key={item}
//         className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
//       >
//         <input
//           type="checkbox"
//           className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
//         />
//         <span>{item}</span>
//       </label>
//     ))}
//   </div>
// );
