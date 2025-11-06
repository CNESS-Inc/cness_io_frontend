import React from "react";
import { Play, Download, Star, Pencil, X } from "lucide-react";
//import { useState } from "react";
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

interface ProductRowProps {
  productNo: string
  thumbnail: string
  courseName: string
  price: string
  category: string
  uploadDate: string
  status: 'pending' | 'approved' | 'rejected'
}
interface ProductItemProps {
  title: string;
  price: string;
  category: string;
  downloads: string;
  rating: string;
  image: string;
}


const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md mt-30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-700 font-[400] text-[14px] leading-[100%] capitalize font-['Open_Sans']">
          {title}
        </h3>
        <div className="w-[40px] h-[40px]">
          <img src={icon} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="text-gray-900 font-['Poppins'] font-semibold text-[28px] leading-[100%]">
        {value}
      </div>
    </div>
  );
};



const ProductItem: React.FC<ProductItemProps> = ({
  title,
  price,
  category,
  downloads,
  rating,
  image,
}) => {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none">
      <img
        src={image}
        alt={title}
        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 space-y-1">
        <h4 className="text-gray-900 text-sm font-medium leading-snug line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 text-sm font-semibold">{price}</span>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="bg-purple-50 px-2 py-1 rounded-full text-gray-700">
              🕊️ Peaceful
            </span>
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              <span>{category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{downloads}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const products = [
  {
    title: "Master Yoga: Flexibility & Mindfulness Training",
    price: "$1299",
    category: "Courses",
    downloads: "42k",
    rating: "4.8",
    image: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
  },
  {
    title: "Master Yoga: Flexibility & Mindfulness Training akjhscdf asdsad",
    price: "$1299",
    category: "Courses",
    downloads: "42k",
    rating: "4.8",
    image: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
  },
  {
    title: "Master Yoga: Flexibility & Mindfulness Training",
    price: "$1299",
    category: "Courses",
    downloads: "42k",
    rating: "4.8",
    image: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
  },
  {
    title: "Master Yoga: Flexibility & Mindfulness Training",
    price: "$1299",
    category: "Courses",
    downloads: "42k",
    rating: "4.8",
    image: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
  },
];


const ProductRow: React.FC<ProductRowProps> = ({ 
  productNo, 
  thumbnail, 
  courseName, 
  price, 
  category, 
  uploadDate, 
  status 
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-100 text-purple-600'
      case 'approved':
        return 'bg-green-100 text-green-600'
      case 'rejected':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="py-6 px-6 text-gray-900 text-base">{productNo}</td>
      <td className="py-6 px-6">
        <img 
          src={thumbnail} 
          alt="Product thumbnail"
          className="w-22.25 h-14.5 rounded object-cover"
        />
      </td>
      <td className="py-6 px-6 text-gray-900 text-sm leading-5 max-w-31.25">{courseName}</td>
      <td className="py-6 px-6 text-gray-900 text-base">{price}</td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-gray-900" />
          <span className="text-gray-900 text-base">{category}</span>
        </div>
      </td>
      <td className="py-6 px-6 text-gray-900 text-base">{uploadDate}</td>
      <td className="py-6 px-6">
        <span className={`px-5 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          
          <button className="text-gray-600 hover:text-gray-800">
            <Pencil className="w-6 h-6" fill="black" />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
      </td>
    </tr>
  )
}

const queue = [
    {
      productNo: "#P0012",
      thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
      courseName: "Soft guitar moods that heals your inner pain",
      price: "$1259",
      category: "Course",
      uploadDate: "12 Oct, 2025",
      status: "pending" as const
    },
    {
      productNo: "#P0013",
      thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
      courseName: "Soft guitar moods that heals your inner pain",
      price: "$1259",
      category: "Course",
      uploadDate: "12 Oct, 2025",
      status: "approved" as const
    },
    {
      productNo: "#P0014",
      thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
      courseName: "Soft guitar moods that heals your inner pain",
      price: "$1259",
      category: "Course",
      uploadDate: "12 Oct, 2025",
      status: "rejected" as const
    }
  ]


const VendorDashboard: React.FC = () => {

const chartData = [
  { week: "Week 6", date: "1 - 7 Oct, 2025", value: "$1200", height: 180 },
  { week: "Week 5", date: "8 - 14 Oct, 2025", value: "$950", height: 140 },
  { week: "Week 4", date: "15 - 21 Oct, 2025", value: "$1210", height: 200 },
  { week: "Week 3", date: "12 - 18 October, 2025", value: "$2435", height: 240 },
  { week: "Week 2", date: "22 - 28 Oct, 2025", value: "$1280", height: 210 },
  { week: "Week 1", date: "29 Oct - 4 Nov, 2025", value: "$700", height: 110 },
];

  //const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-30">
        <StatCard
          title="Total Revenue"
          value="$23,456"
          icon="https://static.codia.ai/image/2025-10-29/6i7pEM917T.png"
        />
        <StatCard
          title="Pending Amount"
          value="$2341"
          icon="https://static.codia.ai/image/2025-10-29/e3MnRCeett.png"
        />
        <StatCard
          title="Total Purchases"
          value="456"
          icon="https://static.codia.ai/image/2025-10-29/t5WgNvrOim.png"
        />
        <StatCard
          title="Total Products"
          value="12"
          icon="https://static.codia.ai/image/2025-10-29/2Z99YrY7fk.png"
        />
      </div>

      {/* Sales Summary + Best Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        {/* Sales Summary */}
      
 <div className="col-span-2 bg-white border border-[#E6E8EC] rounded-xl p-6 shadow-sm">
      {/* Header */}
      <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] mb-1">
        Sales Summary
      </h2>
      <p className="text-gray-500 text-sm mb-6 font-['Open_Sans']">
        Will update every week’s data
      </p>

       {/* Chart Container */}
  <div className="relative h-[400px] px-5 flex items-end justify-between overflow-visible rounded-xl">
    {/* Dotted Vertical Lines */}
    <div className="absolute flex justify-between px-[16px] pointer-events-none">
      {chartData.map((_, i) => (
        <div
          key={i}
          className="h-full border-l border-dashed border-[#E6E8EC] opacity-70"
        />
      ))}
    </div>

    {/* Bars */}
    {chartData.map((bar, i) => (
      <div
        key={i}
        className="relative flex flex-col items-center justify-end group"
        style={{ minWidth: 60 }}
      >
        {/* Tooltip */}
        <div className="absolute -top-[85px] left-1/2 -translate-x-1/2 z-30 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="bg-white border border-[#B197FC] rounded-xl shadow-lg px-3 py-2 text-center min-w-[130px]">
            <div className="text-gray-500 text-[12px]">{bar.date}</div>
            <div className="text-gray-900 font-semibold text-[16px] mt-[2px]">
              {bar.value}
            </div>
          </div>
        </div>

        {/* Line + Circle + Bar */}
        <div className="flex flex-col items-center relative">
          {/* Line with Circle inside */}
          <div className="bg-gradient-to-b from-[#7177FE]/60 to-transparent relative">
            <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-[38px] h-[38px] rounded-full border border-dashed border-[#B197FC] flex items-center justify-center">
                <div className="w-[28px] h-[28px] rounded-full bg-[#7177FE] shadow-md" />
              </div>
            </div>
          </div>


          </div>

          {/* Bar */}
          <div
            className="w-[38px] mt-[6px] rounded-t-full overflow-hidden bg-gradient-to-t from-[#E9EAFF]/40 to-[#7177FE]/80 shadow-sm"
            style={{ height: bar.height }}
          />
        </div>

        {/* Label */}
        <span className="text-gray-600 text-[14px] mt-3">{bar.week}</span>
      </div>
    ))}
  </div>
</div>


        {/* Best Selling */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] mb-1">
            Best Selling
          </h2>
          <p className="text-gray-500 text-sm mb-5 font-['Open_Sans']">
            Top 4 Best-Selling Products
          </p>

          <div className="space-y-4">
            {products.map((product, index) => (
              <ProductItem key={index} {...product} />
            ))}
          </div>
        </div>
      </div>

{/* Product Submission Queue */}
      <div className="space-y-4 mt-10">
      <div>
       <h2 className="text-gray-800 font-['Poppins'] font-semibold text-[18px] leading-[130%] tracking-[0] capitalize mb-0.5">
Product Submission Queue</h2>
<p className="text-gray-600 font-['Open_Sans'] font-[400] text-[14px] leading-[115%] tracking-[0] mt-2">
Check the status of all newly submitted digital products and take action quickly</p>
      </div>
      
  <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
    <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[8%]">P.No</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">Thumbnail</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[20%]">Course name</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">Price</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[12%]">Categories</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">Uploaded Date</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">Status</th>
          <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[8%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((product, index) => (
              <ProductRow key={index} {...product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default VendorDashboard;
