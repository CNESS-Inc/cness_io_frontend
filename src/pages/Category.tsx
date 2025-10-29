import { useState } from "react";
import { X, Filter as FilterIcon } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";

const Category = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {

  // ✅ Active Category State
  const [activeCategory, setActiveCategory] = useState("Videos");

  // ✅ Static Products
  const products = [
    {
      id: "1",
      title: "Soft Guitarmood that Heal Your Inner Pain",
      author: "Redtape",
      rating: 4.8,
      reviews: 120,
      currentPrice: 1259,
      originalPrice: 2444,
      discount: 50,
      duration: "00:23:00",
     mood: "🧘 Spiritual",
      category: "Videos",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "2",
      title: "Calming Piano Waves for Focus and Flow",
      author: "BlueNote",
      rating: 4.9,
      reviews: 98,
      currentPrice: 1599,
      originalPrice: 2999,
      discount: 47,
      duration: "00:25:00",
     mood: "🧘 Spiritual",
       category: "Audio",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "3",
      title: "Chill Beats for Peaceful Evenings",
      author: "MindTune",
      rating: 4.7,
      reviews: 80,
      currentPrice: 999,
      originalPrice: 1999,
      discount: 50,
      duration: "00:20:00",
     mood: "🧘 Spiritual",
       category: "Podcasts",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "4",
      title: "Creative Art Workshop Series",
      author: "Artify",
      rating: 4.9,
      reviews: 52,
      currentPrice: 1899,
      originalPrice: 2599,
      discount: 27,
      duration: "01:00:00",
     mood: "🧘 Spiritual",
       category: "Music",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "5",
      title: "Calming Piano Waves for Focus and Flow",
      author: "BlueNote",
      rating: 4.9,
      reviews: 98,
      currentPrice: 1599,
      originalPrice: 2999,
      discount: 47,
      duration: "00:25:00",
     mood: '🧘 Spiritual',
       category: "Music",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "6",
      title: "Chill Beats for Peaceful Evenings",
      author: "MindTune",
      rating: 4.7,
      reviews: 80,
      currentPrice: 999,
      originalPrice: 1999,
      discount: 50,
      duration: "00:20:00",
     mood: '🧘 Spiritual',
       category: "Videos",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "8",
      title: "Soft Guitarmood that Heal Your Inner Pain",
      author: "Redtape",
      rating: 4.8,
      reviews: 120,
      currentPrice: 1259,
      originalPrice: 2444,
      discount: 50,
      duration: "00:23:00",
     mood: "🧘 Spiritual",
       category: "course",
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
  ];

  const categories = [
    { name: "Videos", count: 4 },
    { name: "Podcasts", count: 3 },
    { name: "Music", count: 3 },
    { name: "Courses", count: 4 },
    { name: "Arts", count: 4 },
  ];

  // ✅ Filter products based on active category
  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  // ✅ Mobile filter drawer toggle
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${
        isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
      } pt-[30px] px-6`}
    >
      <h2 className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-8">
        Shop by Categories
      </h2>

      {/* 🔹 Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 px-5">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category.name)}
            className={`flex items-center gap-3 px-8 py-3 h-[54px] rounded-full border font-medium text-sm transition-all duration-200 ${
              activeCategory === category.name
                ? "border-[#7077FE] text-[#7077FE] bg-white shadow-sm"
                : "border-[#A7A6A6] text-[#A7A6A6] bg-white hover:border-[#7077FE]/60"
            }`}
          >
            <span>{category.name}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === category.name
                  ? "bg-[#7077FE] text-white"
                  : "bg-[#A7A6A6] text-white"
              }`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* 📦 Main Section */}
      <div className="flex w-full max-w-[1600px] mx-auto px-5 py-10 gap-8">
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6"
            onClick={() => setShowMobileFilter(true)}
          >
            <FilterIcon className="w-5 h-5" /> Filters
          </button>

          {/* 🧩 Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No results found in "{activeCategory}"
              </p>
            )}
          </div>
        </div>

        {/* 🧰 Right Sidebar Filter */}
        <div className="hidden md:block w-[300px] flex-shrink-0 -mt-40 px-10">
          <Filter />
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
            <Filter />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
