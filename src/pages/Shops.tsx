import { useState } from "react";
import { Search } from "lucide-react";
import ShopCard from "../components/MarketPlace/Shopcard";
import Pagination from "../components/MarketPlace/Pagination";
import star from "../assets/starm.svg";
import brightstar from "../assets/brightstar.svg";
import fire from "../assets/fire copy.svg";
import light from "../assets/light_person.svg";

const ShopList = () => {
  const [activeFilter, setActiveFilter] = useState("Discover Shops");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = [
    { name: "Trending Shops", icon: fire },
    { name: "Top Rated Creators", icon: star },
    { name: "New & Noteworthy", icon: brightstar },
    { name: "Independent Artist", icon: light },
    { name: "Discover Shops", icon: brightstar },
  ];

  const shops = [
    {
      id: 1,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "Red Tape",
      description:
        "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      name: "Urban Streetwear",
      description:
        "Your go-to shop for edgy urban styles, trendy sneakers, and street fashion essentials.",
      rating: 4.7,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
    {
      id: 3,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "The Art Collective",
      description:
        "Discover exclusive art pieces and creative merch by independent artists and designers.",
      rating: 4.9,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
    {
      id: 4,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "Tech Hub",
      description:
        "Explore the latest gadgets, accessories, and smart tech from innovative creators.",
      rating: 4.6,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
     {
      id: 5,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "Red Tape",
      description:
        "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      name: "Urban Streetwear",
      description:
        "Your go-to shop for edgy urban styles, trendy sneakers, and street fashion essentials.",
      rating: 4.7,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
    {
      id: 7,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "The Art Collective",
      description:
        "Discover exclusive art pieces and creative merch by independent artists and designers.",
      rating: 4.9,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png",
    },
  ];

  // Filters excluding the active one
  const visibleFilters = filters.filter((filter) => filter.name !== activeFilter);

  return (
    <div className="px-6 md:px-8 py-8 font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[20px] font-semibold text-[#242E3A]">
          {activeFilter}
        </h1>
        <p className="text-[#6B7280] text-[14px]">
          Explore creators, brands and digital stores offering exclusive content.
        </p>
      </div>

      {/* Search + Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Search Bar + Filters in one row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative w-[90vw] max-w-full md:w-[290px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-full pl-6 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
            />
            <Search className="absolute right-4 top-3 text-[#897AFF]" size={20} />
          </div>


          {/* Filter Buttons (excluding current active one) */}
          <div className="flex flex-wrap gap-3">
            {visibleFilters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-all"
              >
                <img
                  src={filter.icon}
                  alt={filter.name}
                  className="w-4 h-4 object-contain"
                />
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {shops.map((shop) => (
          <ShopCard key={shop.id} {...shop} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <Pagination currentPage={1} totalPages={4} />
      </div>
    </div>
  );
};

export default ShopList;
