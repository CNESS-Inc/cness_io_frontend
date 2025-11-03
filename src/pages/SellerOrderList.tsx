import React, { useState, useMemo } from "react";
import {
  Music,
  Play,
  Mic,
  BookOpen,
  ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

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

// ✅ Add onClick prop so we can trigger navigation when row is clicked
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
    <td className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] text-[#1A1A1A]">{productNo}</td>
    <td className="py-5 px-6">
      <img
        src={thumbnail}
        alt="Thumbnail"
        className="w-[80px] h-[48px] rounded-md object-cover border border-gray-200"
      />
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">{orderId}</td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A] truncate max-w-[250px]">
      {productName}
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">{price}</td>
    <td className="py-5 px-6">
      <div className="flex items-center gap-2 font-semibold text-[16px] text-[#1A1A1A]">
        {getCategoryIcon(category)}
        <span>{category}</span>
      </div>
    </td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">{buyerName}</td>
    <td className="py-5 px-6 font-semibold text-[16px] text-[#1A1A1A]">{dateOfPurchase}</td>
    <td className="py-5 px-6">
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(status)}`}
      >
        {status}
      </span>
    </td>
  </tr>
);

const initialOrders: OrderRowProps[] = [
  {
    productNo: "P0001",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    orderId: "76899",
    productName: "Hatha Yoga – Mindful movement and deep breathing practice",
    price: "$1259",
    category: "Course",
    buyerName: "Jayson Jaccob",
    dateOfPurchase: "12/12/2024",
    status: "Completed",
  },
  {
    productNo: "P0002",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    orderId: "76899",
    productName: "Relaxing Electric Guitar – Soft instrumental melodies",
    price: "$200",
    category: "Music",
    buyerName: "Jayson Jaccob",
    dateOfPurchase: "02/12/2024",
    status: "Completed",
  },
  {
    productNo: "P0003",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    orderId: "76899",
    productName: "Podcast Talk – Modern mindset with experts",
    price: "$200",
    category: "Podcast",
    buyerName: "Satish",
    dateOfPurchase: "12/12/2024",
    status: "Refunded",
  },
  {
    productNo: "P0004",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    orderId: "76899",
    productName: "Podcast Series – Creative Thinking Methods",
    price: "$200",
    category: "Podcast",
    buyerName: "Neil",
    dateOfPurchase: "12/01/2024",
    status: "Cancelled",
  },
];

const OrderList: React.FC = () => {
  const [orders] = useState(initialOrders);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const navigate = useNavigate(); // ✅ initialize navigation

  // sorting logic stays same
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

        if (key === "status") {
          const orderPriority: Record<string, number> = {
            Completed: 1,
            Refunded: 2,
            Cancelled: 3,
          };
          const aPriority = orderPriority[a.status] || 99;
          const bPriority = orderPriority[b.status] || 99;
          return sortConfig.direction === "asc"
            ? aPriority - bPriority
            : bPriority - aPriority;
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

  // ✅ handle click navigation
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
          className={`w-3 h-3 ${isActive && !isAsc ? "text-black" : "text-gray-400"}`}
        />
      </div>
    );
  };

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
            {sortedOrders.map((order, index) => (
              <OrderRow
                key={index}
                {...order}
                onClick={() => handleRowClick(order)} // ✅ make row clickable
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
