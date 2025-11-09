import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ShopCard from "../components/MarketPlace/Shopcard";
import Pagination from "../components/MarketPlace/Pagination";
import star from "../assets/starm.svg";
import brightstar from "../assets/brightstar.svg";
import fire from "../assets/fire copy.svg";
import light from "../assets/light_person.svg";
import { GetMarketPlaceShops } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const ShopList = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Discover Shops");
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  const filters = [
    { name: "Trending Shops", icon: fire },
    { name: "Top Rated Creators", icon: star },
    { name: "New & Noteworthy", icon: brightstar },
    { name: "Independent Artist", icon: light },
    { name: "Discover Shops", icon: brightstar },
  ];

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoadingShops(true);
      try {
        const response = await GetMarketPlaceShops({
          search: searchTerm,
          limit: 8,
          page: 1,
        });

        const shops = response?.data?.data?.shops || [];
        const pagination = response?.data?.data?.pagination || {};

        setShops(shops);
        setTotalPages(pagination.total_pages || 1);

        if (shops.length === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setShops([]);
      } finally {
        setIsLoadingShops(false);
      }
    };

    fetchShops();
  }, [searchTerm, currentPage]);

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
        {isLoadingShops ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {shops.length > 0 ? (
              shops.map((shop) => (
                <div
                  key={shop?.id}
                  onClick={() => navigate(`/dashboard/shop-detail/${shop.id}`)}
                  className="sm:max-w-[320px] md:max-w-[350px] cursor-pointer h-full"
                >
                  <ShopCard
                    id={shop?.id}
                    image={shop?.shop_image || 'https://static.codia.ai/image/2025-10-24/COYsFisEy4.png'}
                    name={shop?.shop_name}
                    description={shop?.description || ''}
                    rating={shop?.rating || 0}
                    logo={shop?.shop_logo}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No products found for this category
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {shops.length > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ShopList;
