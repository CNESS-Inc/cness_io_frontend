import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown, Filter as FilterIcon } from "lucide-react";
import ProductCard from "../components/MarketPlace/ProductCard";
import Filter from "../components/MarketPlace/Filter";
import Header from "../components/MarketPlace/Marketheader";
import filter from "../assets/filter.svg";

const Wishlist = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // ✅ Static Products
  const products = [
    {
      id: "1",
      title: "Soft Guitar Moods that Heal Your Inner Pain",
      author: "Redtape",
      rating: 4.8,
      reviews: 120,
      currentPrice: 1259,
      originalPrice: 2444,
      discount: 50,
      duration: "00:23:00",
      category: '🕊️ Peaceful',
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
      category: '🧘 Spiritual',
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
      category: '🧘 Spiritual',
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
  ];

  // ✅ Handle Search
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};

const clearSelection = () => {
  setSearchQuery("");
};

  // ✅ Filtered Products
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return product.title.toLowerCase().includes(lower);
  });

  // ✅ Sorting Dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Top Rated");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const options = [
    "Top Rated",
    "Newest Arrival",
    "Most Popular",
    "Price : High to Low",
    "Price : Low to High",
  ];

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div
        className={`transition-all duration-300 ${
          isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[20px] px-6`}
      >
<h2
  className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6">
  My Wishlist
</h2>        {/* 🔍 Search + Sort Section */}
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
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute top-full mt-2 w-60 bg-white border border-[#7077FE] rounded-2xl shadow-lg z-50 p-4 space-y-3">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(option)}
                        className={`block w-full text-left font-poppins font-normal text-[16px] leading-[100%] px-2 py-1 rounded-lg transition-colors ${
                          selected === option
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
        <div className="flex w-full max-w-[1600px] mx-auto px-5 py-10 gap-8">
          <div className="flex-1">
           

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6"
              onClick={() => setShowMobileFilter(true)}
            >
              <FilterIcon className="w-5 h-5" /> Filters
            </button>

            {/* Product Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <ProductCard key={product.id} product={product} isLiked={true} />
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">
      No results found
    </p>
  )}
</div>
          </div>

          {/* 🧰 Filter Sidebar (RIGHT) */}
          <div className="hidden md:block w-[300px] flex-shrink-0 -mt-25 px-10">
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
    </main>
  );
};

export default Wishlist;
