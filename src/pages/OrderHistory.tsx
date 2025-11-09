import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Search,
  X,
  ChevronDown,
  Filter as FilterIcon,
  Video,
  Clock,
  Download,
  WalletCards,
} from "lucide-react";
import Filter from "../components/MarketPlace/Filter";
import filter from "../assets/filter.svg";

const OrderHistory = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const navigate = useNavigate();
  const handleImageClick = (id: string) => {
    navigate(`/dashboard/order-history/${id}`);
  };

  const handleTitleClick = (id: string) => {
    navigate(`/dashboard/order-history/${id}`);
  };

  const demoFilters = {
    category_slug: "technology",
    min_price: "100",
    max_price: "1000",
    language: "English",
    duration: "3 months",
    rating: "4"
  };

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed: ", filters);
  };

  const orders = [
    {
      id: "CN000012",
      title: "Soft guitar moods that heals your inner pain",
      author: "Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      date: "13 October, 2025",
      price: 1259,
      image: "https://cdn.cness.io/digital.svg",
    },
    {
      id: "CN000013",
      title: "Soft guitar moods that heals your inner pain",
      author: "Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      date: "13 October, 2025",
      price: 1259,
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
    },
    {
      id: "CN000014",
      title: "Soft guitar moods that heals your inner pain",
      author: "Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      date: "13 October, 2025",
      price: 1259,
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    },
    {
      id: "CN000015",
      title: "Soft guitar moods that heals your inner pain",
      author: "Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      date: "13 October, 2025",
      price: 1259,
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
    },
  ];

  // Handle Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSelection = () => {
    setSearchQuery("");
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return (
      order.title.toLowerCase().includes(lower) ||
      order.author.toLowerCase().includes(lower) ||
      order.category.toLowerCase().includes(lower) ||
      order.mood.toLowerCase().includes(lower)
    );
  });

  // Sorting Dropdown
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

      <div
        className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
          } pt-[20px] px-6`}
      >
        <h2 className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6">
          My order History
        </h2>

        {/* 🔍 Search + Sort Section */}
        <div className="w-full mx-auto flex items-start justify-between px-5 mt-8 gap-6">
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


            {/* 🧾 Order List */}
            <div className="space-y-5 mt-6">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#FFFFFF] border border-gray-200 rounded-xl shadow-sm p-2 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-md transition-all"
                  >
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-[160px] h-[130px] md:w-[200px] md:h-[160px] object-cover rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(order.id)}
                    />


                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start flex-wrap">
                        <div>
                          <h3
                            className="font-[Poppins] font-semibold text-[16px] text-[#242E3A] mb-1 cursor-pointer hover:underline"
                            onClick={() => handleTitleClick(order.id)}
                          >
                            {order.title}
                          </h3>

                          <p className="text-sm text-gray-500 mb-1">
                            by {order.author}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Video className="w-4 h-4 text-[#7077FE]" />{" "}
                              {order.category}
                            </span>
                            <span>{order.mood}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-[#7077FE]" />
                              Purchased on <strong>{order.date}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 font-medium">
                          Order ID: <span className="text-[#242E3A]">{order.id}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <button className="flex items-center gap-2 bg-[#7077FE] text-white text-[14px] font-[Plus_Jakarta_Sans] font-medium px-4 py-2 rounded-lg hover:bg-[#5E65F6] transition">
                          <WalletCards className="w-4 h-4" />
                          View in Library
                        </button>

                        <button className="flex items-center gap-2 border border-[#7077FE] text-[#7077FE] text-[14px] font-[Plus_Jakarta_Sans] font-medium px-4 py-2 rounded-lg hover:bg-[#F3F4FF] transition">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>

                        <button className="text-[#7077FE] text-[14px] font-[Plus_Jakarta_Sans] font-medium hover:underline">
                          Rate or leave review
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-0 md:ml-auto font-[Poppins] font-semibold text-[18px] text-[#242E3A]">
                      ${order.price}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  No orders found matching your search.
                </p>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6 mt-6"
              onClick={() => setShowMobileFilter(true)}
            >
              <FilterIcon className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* 🧰 Filter Sidebar (RIGHT) */}
          <div className="hidden md:block w-[300px] flex-shrink-0 -mt-25 px-10">
            <Filter filters={demoFilters} onFilterChange={handleFilterChange} />
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
              <Filter filters={demoFilters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistory;
