import React, { useEffect, useState } from "react";
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
  Music,
  BookOpen,
  FileAudio,
  FileText,
  Palette,
} from "lucide-react";
import Filter from "../components/MarketPlace/Filter";
import filter from "../assets/filter.svg";
import { GetOrderDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

type OrderItem = {
  product_id: string;
  product_name: string;
  product_thumbnail: string | null;
  category: string;
  shop_name: string;
  mood: {
    id: string;
    name: string;
    // icon: string;
    slug: string;
  };
  shop_logo: string | null;
  quantity: number;
  price: string;
  item_total: string;
};

type Order = {
  order_id: string;
  purchase_date: string;
  total_amount: string;
  discount_amount: string;
  currency: string;
  payment_status: string;
  transaction_status: string;
  items_count: number;
  items: OrderItem[];
};

const OrderHistory = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Newest First");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const options = [
    "Newest First",
    "Oldest First",
    "Price: High to Low",
    "Price: Low to High",
  ];

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

  // Handle Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSelection = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    fetchOrders();
  }, [selected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await GetOrderDetails();

      const data = response?.data?.data;
      setOrders(data?.orders || []);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
      showToast({
        message: "Failed to load order history",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleViewInLibrary = () => {
    navigate("/dashboard/library");
  };

  const handleDownloadInvoice = () => {
    showToast({
      message: "Invoice download coming soon!",
      type: "info",
      duration: 2000,
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      Video: <Video className="w-4 h-4 text-[#7077FE]" />,
      Music: <Music className="w-4 h-4 text-[#7077FE]" />,
      Course: <BookOpen className="w-4 h-4 text-[#7077FE]" />,
      Podcast: <FileAudio className="w-4 h-4 text-[#7077FE]" />,
      eBook: <FileText className="w-4 h-4 text-[#7077FE]" />,
      Art: <Palette className="w-4 h-4 text-[#7077FE]" />,
    };

    return iconMap[category] || <Video className="w-4 h-4 text-[#7077FE]" />;
  };

  // Flatten orders to display each item separately
  const flattenedOrders = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...order,
      currentItem: item,
    }))
  );

  return (
    <main className="min-h-screen bg-white">

      <div
        className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"} pt-[20px] px-6 md:px-4 lg:px-6`}
      >
        <h2 className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6">
          My order History
        </h2>

        {/* 🔍 Search + Sort Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
          {/* Search Bar */}
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-3 shadow-sm  min-w-[180px] sm:min-w-[152px] md:min-w-[132px] lg:min-w-[200px] xl:min-w-[480px] max-w-[314px] sm:max-w-[292px] md:max-w-[440px] lg:max-w-[520px] xl:max-w-[500px]">           
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
              className="flex-1 bg-transparent outline-none text-[#9747FF] text-sm placeholder-gray-400"
            />
            <Search className="w-5 h-5 text-[#9747FF] ml-3" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-[#7077FE] rounded-full shadow-sm text-[#7077FE] font-medium text-sm md:text-base hover:shadow-md transition-all sm:w-auto min-w-[140px] sm:min-w-[200px] md:min-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:min-w-[220px] xl:min-w-[180px]"
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
        {/* 📦 Main Section */}
        <div className="flex w-full mx-auto px-5 py-10 gap-8">
          <div className="flex-1">

            {/* 🧾 Order List */}

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) :
              flattenedOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <WalletCards size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? "No orders found" : "No orders yet"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "Try searching with different keywords"
                      : "Start shopping to see your order history"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => navigate("/dashboard/market-place")}
                      className="bg-[#7077FE] text-white px-6 py-3 rounded-lg hover:bg-[#5E65F6] transition font-medium"
                    >
                      Explore Marketplace
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-5 mt-6">
                  {flattenedOrders.map((order, index) => {
                    const item = order.currentItem;
                    return (
                      <div
                        key={`${order.order_id}-${index}`}
                        className="bg-[#FFFFFF] border border-gray-200 rounded-xl shadow-sm p-2 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-md transition-all"
                      >
                        <img
                          src={
                            item.product_thumbnail ||
                            "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png"
                          }
                          alt={item.product_name}
                          className="w-[160px] h-[130px] md:w-[200px] md:h-[160px] object-cover rounded-lg cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/order-history/${order.order_id}`)
                          }
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start flex-wrap">
                            <div>
                              <h3
                                className="font-[Poppins] font-semibold text-[16px] text-[#242E3A] mb-1 cursor-pointer hover:underline"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/order-history/${order.order_id}`
                                  )
                                }
                              >
                                {item.product_name}
                              </h3>

                              <p className="text-sm text-gray-500 mb-1">
                                by {item.shop_name}
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(item.category)}
                                  {item.category}
                                </span>
                                <span>
                                  {/* {item.mood.icon} */}
                                  {item.mood.name}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-[#7077FE]" />
                                  Purchased on <strong> {new Date(
                                    order.purchase_date
                                  ).toLocaleDateString()}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-500 font-medium">
                              Order ID: <span className="text-[#242E3A]">{order.order_id}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-4">
                            <button
                              onClick={handleViewInLibrary}
                              className="flex items-center gap-2 bg-[#7077FE] text-white text-[14px] font-[Plus_Jakarta_Sans] font-medium px-4 py-2 rounded-lg hover:bg-[#5E65F6] transition">
                              <WalletCards className="w-4 h-4" />
                              View in Library
                            </button>

                            <button
                              onClick={() => handleDownloadInvoice()}
                              className="flex items-center gap-2 border border-[#7077FE] text-[#7077FE] text-[14px] font-[Plus_Jakarta_Sans] font-medium px-4 py-2 rounded-lg hover:bg-[#F3F4FF] transition">
                              <Download className="w-4 h-4" />
                              Download Invoice
                            </button>

                            <button
                              onClick={() => navigate(`/dashboard/order-history/${order.order_id}?pid=${item.product_id}  `)}
                              className="text-[#7077FE] text-[14px] font-[Plus_Jakarta_Sans] font-medium hover:underline">
                              Rate or leave review
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 md:mt-0 md:ml-auto font-[Poppins] font-semibold text-[18px] text-[#242E3A]">
                          ${item.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#7077FE] text-white rounded-full mb-6 mt-6"
              onClick={() => setShowMobileFilter(true)}
            >
              <FilterIcon className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* 🧰 Filter Sidebar (RIGHT) */}
          <div className="hidden md:block w-[280px] flex-shrink-0 -mt-25 px-10">
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