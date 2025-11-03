import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
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

const orders = [
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Advanced React Masterclass",
        price: "$1259",
        category: "Course",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "12/12/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Modern Marketing Strategies",
        price: "$5000",
        category: "Podcast",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "11/25/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Business Growth Secrets Podcast",
        price: "$12000",
        category: "Podcast",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "10/18/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Web Development Essentials",
        price: "$394",
        category: "Course",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "09/10/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Smooth Jazz Collection",
        price: "$394",
        category: "Music",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "08/05/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Entrepreneurship Insights",
        price: "$230",
        category: "Podcast",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "07/20/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Python Programming Basics",
        price: "$230",
        category: "Course",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "06/15/2024",
    },
    {
        pNo: "#P0001",
        orderId: 76899,
        productName: "Classical Music Favorites",
        price: "$230",
        category: "Music",
        buyerName: "Jayson Jaccob",
        dateOfPurchase: "05/10/2024",
    },
];

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

const OrderRow: React.FC<OrderRowProps> = ({
    productNo,
    orderId,
    productName,
    price,
    category,
    buyerName,
    dateOfPurchase,
}) => (
    <tr
        className="border-b border-[#CBD5E1] hover:bg-[#F9FAFB] transition cursor-pointer"
    >
        <td className="relative py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#1A1A1A]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {productNo}
        </td>
        <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {orderId}
        </td>
        <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A] truncate max-w-[200px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {productName}
        </td>
        <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {price}
        </td>
        <td className="relative py-4 px-6">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            <div className="flex items-center gap-2 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
                {getCategoryIcon(category)}
                <span>{category}</span>
            </div>
        </td>
        <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A] truncate max-w-[150px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {buyerName}
        </td>
        <td className="relative py-4 px-6 font-['Open_Sans'] font-normal text-[14px] text-[#1A1A1A]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F7F7F7]"></div>
            {dateOfPurchase}
        </td>
    </tr>
);

const SellerSales: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const navigate = useNavigate();

    // sorting logic
    const sortedOrders = useMemo(() => {
        let sorted = [...orders];
        if (sortConfig) {
            sorted.sort((a, b) => {
                const key = sortConfig.key as keyof typeof orders[0];

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
    }, [sortConfig]);

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
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
        <div className="flex flex-col gap-4 w-full h-full">
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
                        Sales Information
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/seller-sales/withdrawal")}
                        className="border border-[#7077FE] py-3 px-5 bg-white text-[#7077FE] font-medium text-base rounded-md">
                        Withdraw
                    </button>
                </div>
                <div className="mt-2 py-5 px-4 bg-white border border-[#CBD5E1] flex flex-col gap-4 rounded-xl">
                    <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-md flex flex-col gap-4">
                            <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                                Customer
                            </h2>
                            <input
                                type="text"
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter Costumer Name"
                            />
                        </div>
                        <div className="rounded-md flex flex-col gap-4">
                            <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                                Order ID
                            </h2>
                            <input
                                type="text"
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter Invoice ID"
                            />
                        </div>
                        <div className="rounded-md flex flex-col gap-4">
                            <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                                Start Date
                            </h2>
                            <div className="relative w-full">
                                <input
                                    id="startDate"
                                    type="date"
                                    required
                                    className="peer border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] pr-10 text-transparent focus:text-gray-700 valid:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />

                                <label
                                    htmlFor="startDate"
                                    className="opacity-60 absolute left-[15px] top-1/2 -translate-y-1/2 text-[rgba(19, 19, 19, 0.6)] text-sm font-light pointer-events-none transition-all duration-150 peer-focus:opacity-0 peer-valid:opacity-0">
                                    Select
                                </label>

                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => {
                                        const input = document.getElementById("startDate") as HTMLInputElement | null;
                                        input?.showPicker();
                                    }}
                                >
                                    <PiCalendarBlankLight className="text-[#494949]" size={20} />
                                </div>
                            </div>


                        </div>
                        <div className="rounded-md flex flex-col gap-4">
                            <h2 className="text-black font-['Open_Sans'] font-normal text-base">
                                End Date
                            </h2>
                            <div className="relative w-full">
                                <input
                                    id="endDate"
                                    type="date"
                                    required
                                    className="peer border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] pr-10 text-transparent focus:text-gray-700 valid:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(19,19,19,0.6)] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />

                                <label
                                    htmlFor="endDate"
                                    className="opacity-60 absolute left-[15px] top-1/2 -translate-y-1/2 text-[rgba(19, 19, 19, 0.6)] text-sm font-light pointer-events-none transition-all duration-150 peer-focus:opacity-0 peer-valid:opacity-0">
                                    Select
                                </label>

                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => {
                                        const input = document.getElementById("endDate") as HTMLInputElement | null;
                                        input?.showPicker();
                                    }}
                                >
                                    <PiCalendarBlankLight className="text-[#494949]" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="font-['Plus Jakarta Sans'] px-5 py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-medium">Search</button>
                    </div>
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
                                        className={`py-3 px-6 font-['Open_Sans'] font-semibold text-[13px] text-[#64748B] uppercase tracking-wide ${key && "cursor-pointer select-none hover:text-[#7077FE]"
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
                                    productNo={order.pNo}
                                    orderId={String(order.orderId)}
                                    productName={order.productName}
                                    price={order.price}
                                    category={order.category}
                                    buyerName={order.buyerName}
                                    dateOfPurchase={order.dateOfPurchase}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerSales;