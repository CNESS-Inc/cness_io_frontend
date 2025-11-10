import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { GetMarketPlaceBuyerCategories } from "../../Common/ServerAPI";
import { useLocation } from "react-router-dom";

interface FilterProps {
  filters: {
    category_slug?: string;
    min_price?: string;
    max_price?: string;
    language?: string;
    duration?: string;
    rating?: string;
  };
  onFilterChange: (filters: any) => void;
}

const languages = ["English", "Spanish", "French"];
const durations = ["< 30 min", "30 - 120 min", "> 2 hrs"];
const ratings = ["4+ Stars", "3+ Stars", "2+ Stars"];

const FilterSidebar: React.FC<FilterProps> = ({ filters, onFilterChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
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

  const handleDurationToggle = (duration: string) => {
    const newFilters = {
      ...localFilters,
      duration: localFilters.duration === duration ? "" : duration,
    };
    setLocalFilters(newFilters); duration
  };

  const handleRatingToggle = (rating: string) => {
    const newFilters = {
      ...localFilters,
      rating: localFilters.rating === rating ? "" : rating,
    };
    setLocalFilters(newFilters);
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
              placeholder="$0"
              value={localFilters.min_price || ""}
              onChange={(e) => handlePriceChange('min_price', e.target.value)}
              onBlur={handlePriceBlur}
              className="w-[90px] px-3 py-2 border rounded-lg text-sm font-semibold font-[poppins] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="$50"
              value={localFilters.max_price || ""}
              onChange={(e) => handlePriceChange('max_price', e.target.value)}
              onBlur={handlePriceBlur}
              className="w-[90px] px-3 py-2 border rounded-lg text-sm font-semibold font-[poppins] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
          </div>
        </div>

        {/* 🌍 Language */}
        <div className="space-y-2 mb-8">
          <h3 className="text-[16px] font-semibold">Language</h3>
          {languages.map((language) => (
            <label
              key={language}
              className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.language === language}
                onChange={() => handleLanguageToggle(language)}
                className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
              />
              <span>{language}</span>
            </label>
          ))}
        </div>

        {/* ⏱️ Duration */}
        <div className="space-y-2 mb-8">
          <h3 className="text-[16px] font-semibold">Duration</h3>
          {durations.map((duration) => (
            <label
              key={duration}
              className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.duration === duration}
                onChange={() => handleDurationToggle(duration)}
                className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
              />
              <span>{duration}</span>
            </label>
          ))}
        </div>

        {/* ⭐ Ratings */}
        <div className="space-y-2 mb-8">
          <h3 className="text-[16px] font-semibold">Ratings</h3>
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-2 text-sm text-gray-700 font-[poppins] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.rating === rating}
                onChange={() => handleRatingToggle(rating)}
                className="w-4 h-4 rounded border-gray-300 font-[poppins] text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
              />
              <span>{rating}</span>
            </label>
          ))}
        </div>

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
