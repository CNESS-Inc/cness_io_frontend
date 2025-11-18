import React, { useState, useMemo, useEffect } from "react";
import {
  Music,
  Play,
  Mic,
  BookOpen,
  ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetSellerOrders } from "../Common/ServerAPI"; // <-- PATH CHECK KAR LENA

interface OrderRowProps {
  productNo: string;
  thumbnail: string;
  orderId: string;
  productName: string;
  price: string;
  category: string;
  buyerName: string;
  dateOfPurchase: string;
  status: "Completed" | "Refunded" | "Cancelled";
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-[#E7F9ED] text-[#0F9D58]";
    case "Refunded":
      return "bg-[#F3E8FF] text-[#7E3AF2]";
    case "Cancelled":
      return "bg-[#FFE8E8] text-[#D32F2F]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Music":
      return <Music className="w-4 h-4 text-gray-800" />;
    case "Course":
      return <BookOpen className="w-4 h-4 text-gray-800" />;
    case "Podcast":
      return <Mic className="w-4 h-4 text-gray-800" />;
    case "Video":
      return <Play className="w-4 h-4 text-gray-800" />;
    case "Arts":
      return <ImageIcon className="w-4 h-4 text-gray-800" />;
    default:
      return null;
  }
};

const OrderRow: React.FC<OrderRowProps & { onClick: () => void }> = ({
  productNo,
  thumbnail,
  orderId,
  productName,
  price,
  category,
  buyerName,
  dateOfPurchase,
  status,
  onClick,
}) => (
  <tr
    onClick={onClick}
    className="border-b border-gray-100 hover:bg-[#F9FAFB] transition cursor-pointer"
  >
    <td className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] text-[#1A1A1A]">
      {productNo}
    </td>
    <td className="py-5 px-6">
      <img
        src={thumbnail}
        alt="Thumbnail"
        className="w-[80px] h-[48px] rounded-md object-cover border border-gray-200"
      />
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">
      {orderId}
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A] truncate max-w-[250px]">
      {productName}
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">
      {price}
    </td>
    <td className="py-5 px-6">
      <div className="flex items-center gap-2 font-semibold text-[16px] text-[#1A1A1A]">
        {getCategoryIcon(category)}
        <span>{category}</span>
      </div>
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">
      {buyerName}
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">
      {dateOfPurchase}
    </td>
    <td className="py-5 px-6">
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
          status
        )}`}
      >
        {status}
      </span>
    </td>
  </tr>
);

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderRowProps[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await GetSellerOrders();
        console.log("SELLER ORDERS API RESPONSE:", res);

        // 👇 Postman response: data -> data -> orders
        const apiOrders = res?.data?.data?.orders || [];

        const formatted = apiOrders.map((o: any, index: number) => ({
          productNo: "P" + String(index + 1).padStart(4, "0"),
          thumbnail:
            o.product_thumbnail ??
            "https://via.placeholder.com/80x48?text=No+Image",
          orderId: o.order_id,
          productName: o.product_name,
          price: "$" + o.price,
          category: o.category_name,
          buyerName: o.buyer_name,
          dateOfPurchase: new Date(
            o.date_of_purchase
          ).toLocaleDateString(),
          status: "Completed", // abhi UI ke liye fixed, baad me map kar sakte hain
        }));

        setOrders(formatted);
      } catch (err: any) {
        console.error("ORDER FETCH ERROR:", err);
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const sortedOrders = useMemo(() => {
    let sorted = [...orders];
    if (sortConfig) {
      sorted.sort((a, b) => {
        const key = sortConfig.key as keyof OrderRowProps;

        if (key === "price") {
          const priceA = Number(a.price.replace("$", ""));
          const priceB = Number(b.price.replace("$", ""));
          return sortConfig.direction === "asc" ? priceA - priceB : priceB - priceA;
        }

        if (key === "dateOfPurchase") {
          const [dayA, monthA, yearA] = a.dateOfPurchase.split("/").map(Number);
          const [dayB, monthB, yearB] = b.dateOfPurchase.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
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
  }, [orders, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (order: OrderRowProps) => {
    navigate(`/dashboard/orderlist/${order.productNo}`, { state: order });
  };

  const renderSortIcons = (key: string) => {
    const isActive = sortConfig?.key === key;
    const isAsc = sortConfig?.direction === "asc";
    return (
      <div className="flex flex-col items-center -space-y-[2px]">
        <ChevronUp
          className={`w-3 h-3 ${isActive && isAsc ? "text-black" : "text-gray-400"}`}
        />
        <ChevronDown
          className={`w-3 h-3 ${
            isActive && !isAsc ? "text-black" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
        Order List
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F7] border-b border-gray-200">
              {[
                { label: "P.No", key: "" },
                { label: "Thumbnail", key: "" },
                { label: "Order ID", key: "" },
                { label: "Product Name", key: "productName" },
                { label: "Price", key: "price" },
                { label: "Categories", key: "category" },
                { label: "Buyer Name", key: "buyerName" },
                { label: "Date Of Purchase", key: "dateOfPurchase" },
                { label: "Status", key: "status" },
              ].map(({ label, key }) => (
                <th
                  key={label}
                  onClick={() => key && requestSort(key)}
                  className={`py-4 px-6 font-['Open_Sans'] font-normal text-[15px] text-[#494949] capitalize cursor-pointer select-none ${
                    key && "hover:text-[#7077FE]"
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
            {sortedOrders.length === 0 ? (
              <tr>
                <td className="py-6 px-6 text-center text-gray-500" colSpan={9}>
                  No orders found.
                </td>
              </tr>
            ) : (
              sortedOrders.map((order, index) => (
                <OrderRow
                  key={index}
                  {...order}
                  onClick={() => handleRowClick(order)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
