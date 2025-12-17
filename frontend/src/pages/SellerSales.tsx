import { GetSellerSalesHistory } from "../Common/ServerAPI";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PiCalendarBlankLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { HiOutlineVideoCamera, HiOutlineMusicalNote } from "react-icons/hi2";
import { MdOutlinePodcasts } from "react-icons/md";

interface OrderRowProps {
  productNo: string;
  orderId: string;
  productName: string;
  price: string;
  category: string;
  buyerName: string;
  dateOfPurchase: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "course":
      return <HiOutlineVideoCamera className="w-5 h-5" />;
    case "music":
      return <HiOutlineMusicalNote className="w-5 h-5" />;
    case "podcast":
      return <MdOutlinePodcasts className="w-5 h-5" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
};

const OrderRow: React.FC<OrderRowProps> = ({
  productNo,
  orderId,
  productName,
  price,
  category,
  buyerName,
  dateOfPurchase,
}) => (
  <tr className="border-b border-[#CBD5E1] hover:bg-[#F9FAFB] transition cursor-pointer">
    <td className="relative py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#1A1A1A]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {productNo}
    </td>
    <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {orderId}
    </td>
    <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A] truncate max-w-[200px]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {productName}
    </td>
    <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {price}
    </td>
    <td className="relative py-4 px-6">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      <div className="flex items-center gap-2 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
        {getCategoryIcon(category)}
        <span>{category}</span>
      </div>
    </td>
    <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A] truncate max-w-[150px]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {buyerName}
    </td>
    <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F7F7F7]"></div>
      {formatDate(dateOfPurchase)}
    </td>
  </tr>
);

const SellerSales: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [form, setForm] = useState({
    customer: "",
    orderId: "",
    startDate: "",
    endDate: "",
  });
  const [orders, setOrders] = useState<OrderRowProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });
  const navigate = useNavigate();

  // Controlled form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // New fetch function using GetSellerSalesHistory
  const fetchSalesData = async (page: number = pagination.page, limit: number = pagination.limit) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await GetSellerSalesHistory({
        customer: form.customer || undefined,
        orderId: form.orderId || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        page,
        limit,
      });
      
      const transactions = res.data?.data?.transactions || [];
      const paginationData = res.data?.data?.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0
      };

      const mappedOrders: OrderRowProps[] = transactions.map(
        (t: any) => ({
          productNo: t.product_id,
          orderId: t.order_id ?? "",
          productName: t.product_name ?? "",
          price: t.price ?? "",
          category: t.category ?? "",
          buyerName: t.buyer_name ?? "",
          dateOfPurchase: t.purchase_date ?? "",
        })
      );
      
      setOrders(mappedOrders);
      setPagination(paginationData);
    } catch (err: any) {
      setOrders([]);
      setError("Failed to fetch transactions.");
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search - now uses the new fetch function
  const handleSearch = async (page: number = pagination.page, limit: number = pagination.limit) => {
    await fetchSalesData(page, limit);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchSalesData(newPage, pagination.limit);
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    fetchSalesData(1, newLimit); // Reset to page 1 when limit changes
  };

  // Fetch on mount
  useEffect(() => {
    fetchSalesData(1, 10);
    // eslint-disable-next-line
  }, []);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    let sorted = [...orders];
    if (sortConfig) {
      sorted.sort((a, b) => {
        const key = sortConfig.key as keyof OrderRowProps;
        if (key === "price") {
          const priceA = Number(String(a.price).replace(/\D/g, ""));
          const priceB = Number(String(b.price).replace(/\D/g, ""));
          return sortConfig.direction === "asc"
            ? priceA - priceB
            : priceB - priceA;
        }
        if (key === "dateOfPurchase") {
          const dateA = new Date(a.dateOfPurchase);
          const dateB = new Date(b.dateOfPurchase);
          return sortConfig.direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
        const valA = String(a[key] ?? "").toLowerCase();
        const valB = String(b[key] ?? "").toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [sortConfig, orders]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcons = (key: string) => {
    const isActive = sortConfig?.key === key;
    const isAsc = sortConfig?.direction === "asc";
    return (
      <div className="flex flex-col items-center -space-y-0.5">
        <ChevronUp
          className={`w-3 h-3 ${
            isActive && isAsc ? "text-black" : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 ${
            isActive && !isAsc ? "text-black" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.page;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
            Sales Information
          </h2>
          <button
            onClick={() => navigate("/dashboard/seller-sales/withdrawal")}
            className="border border-[#7077FE] py-2 md:py-3 px-4 md:px-5 bg-white text-[#7077FE] font-medium text-base rounded-md"
          >
            Withdraw
          </button>
        </div>
        {/* --- RESPONSIVE FORM --- */}
        <div className="mt-2 py-5 px-2 md:px-4 bg-white border border-[#CBD5E1] flex flex-col gap-3 md:gap-4 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-md flex flex-col gap-2 md:gap-4">
              <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                Customer
              </h2>
              <input
                name="customer"
                value={form.customer}
                onChange={handleInputChange}
                type="text"
                className="border border-[#CBD5E1] rounded-md w-full py-2 md:py-2.5 ps-2 md:ps-[15px] placeholder-[rgba(19,19,19,0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)]"
                placeholder="Enter Customer Name"
              />
            </div>
            <div className="rounded-md flex flex-col gap-2 md:gap-4">
              <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                Order ID
              </h2>
              <input
                name="orderId"
                value={form.orderId}
                onChange={handleInputChange}
                type="text"
                className="border border-[#CBD5E1] rounded-md w-full py-2 md:py-2.5 ps-2 md:ps-[15px] placeholder-[rgba(19,19,19,0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)]"
                placeholder="Enter Invoice ID"
              />
            </div>
            <div className="rounded-md flex flex-col gap-2 md:gap-4">
              <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                Start Date
              </h2>
              <div className="relative w-full">
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  id="startDate"
                  type="date"
                  required
                  className="peer border border-[#CBD5E1] rounded-md w-full py-2 md:py-2.5 ps-2 md:ps-[15px] pr-8 md:pr-10 text-transparent focus:text-gray-700 valid:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <label
                  htmlFor="startDate"
                  className="opacity-60 absolute left-2 md:left-[15px] top-1/2 -translate-y-1/2 text-[rgba(19,19,19,0.6)] text-sm font-light pointer-events-none transition-all duration-150 peer-focus:opacity-0 peer-valid:opacity-0"
                >
                  Select
                </label>
                <div
                  className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById(
                      "startDate"
                    ) as HTMLInputElement | null;
                    input?.showPicker?.();
                  }}
                >
                  <PiCalendarBlankLight className="text-[#494949]" size={20} />
                </div>
              </div>
            </div>
            <div className="rounded-md flex flex-col gap-2 md:gap-4">
              <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                End Date
              </h2>
              <div className="relative w-full">
                <input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInputChange}
                  id="endDate"
                  type="date"
                  required
                  className="peer border border-[#CBD5E1] rounded-md w-full py-2 md:py-2.5 ps-2 md:ps-[15px] pr-8 md:pr-10 text-transparent focus:text-gray-700 valid:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <label
                  htmlFor="endDate"
                  className="opacity-60 absolute left-2 md:left-[15px] top-1/2 -translate-y-1/2 text-[rgba(19,19,19,0.6)] text-sm font-light pointer-events-none transition-all duration-150 peer-focus:opacity-0 peer-valid:opacity-0"
                >
                  Select
                </label>
                <div
                  className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById(
                      "endDate"
                    ) as HTMLInputElement | null;
                    input?.showPicker?.();
                  }}
                >
                  <PiCalendarBlankLight className="text-[#494949]" size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              className="font-['Plus Jakarta Sans'] px-4 md:px-5 py-2 md:py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-medium"
              onClick={() => handleSearch(1, pagination.limit)} // Reset to page 1 on search
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
          Transaction Details
        </h2>
        <div className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7]">
                {[
                  { label: "P.No", key: "" },
                  { label: "Order ID", key: "" },
                  { label: "Product Name", key: "productName" },
                  { label: "Price", key: "price" },
                  { label: "Categories", key: "category" },
                  { label: "Buyer Name", key: "buyerName" },
                  { label: "Date Of Purchase", key: "dateOfPurchase" },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={() => key && requestSort(key)}
                    className={`py-3 px-6 font-['Open_Sans'] font-semibold text-[13px] text-[#64748B] uppercase tracking-wide ${
                      key && "cursor-pointer select-none hover:text-[#7077FE]"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {key && renderSortIcons(key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order, index) => (
                  <OrderRow key={index} {...order} />
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.total_pages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#CBD5E1] bg-white">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-1 border rounded ${
                      page === pagination.page
                        ? 'bg-[#7077FE] text-white border-[#7077FE]'
                        : page === '...'
                        ? 'border-transparent cursor-default'
                        : 'border-gray-300 hover:bg-gray-50'
                    } disabled:cursor-default`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSales;