import React from "react";
import { Video, Pencil, X, Plus } from "lucide-react";
import Pagination from "../components/MarketPlace/Pagination";
import CategoryModal from "../components/MarketPlace/CategoryModel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductRowProps {
  productNo: string;
  thumbnail: string;
  courseName: string;
  price: string;
  category: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
}

const ProductRow: React.FC<ProductRowProps> = ({
  productNo,
  thumbnail,
  courseName,
  price,
  category,
  uploadDate,
  status,
}) => {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-purple-100 text-purple-600";
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const productData = {
    productNo,
    thumbnail,
    courseName,
    price,
    category,
    uploadDate,
    status,
  };


  return (
    <tr className="border-b border-gray-100">
      <td className="py-6 px-6 text-[#1A1A1A] text-base">{productNo}</td>
      <td className="py-6 px-6">
        <img
          src={thumbnail}
          alt="Product thumbnail"
          className="w-[90px] h-[58px] rounded-md object-cover"
        />
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-sm leading-5 max-w-[220px] truncate">
        {courseName}
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-base">{price}</td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-black" />
          <span className="text-[#1A1A1A] text-base">{category}</span>
        </div>
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-base">{uploadDate}</td>
      <td className="py-6 px-6">
        <span
          className={`px-5 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
            status
          )}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
           <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() =>
              navigate(`/dashboard/products/${category.toLowerCase()}/edit/${productNo}`, {
                state: { product: productData }, // Pass the current product details
              })
            }
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const queue = [
   {
    productNo: "P0011",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "Course",
    uploadDate: "12 Oct, 2025",
    status: "pending" as const,
  },
  {
    productNo: "P0012",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "Course",
    uploadDate: "12 Oct, 2025",
    status: "pending" as const,
  },
  {
    productNo: "P0013",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "Course",
    uploadDate: "12 Oct, 2025",
    status: "approved" as const,
  },
  {
    productNo: "P0014",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "Course",
    uploadDate: "12 Oct, 2025",
    status: "rejected" as const,
  },

   {
    productNo: "P0015",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "video",
    uploadDate: "12 Oct, 2025",
    status: "approved" as const,
  },

   {
    productNo: "P0016",
    thumbnail: "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png",
    courseName: "Soft guitar moods that heals your inner pain",
    price: "$1259",
    category: "Audio",
    uploadDate: "12 Oct, 2025",
    status: "rejected" as const,
  },
];

const SellerProductList: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectCategory = (category: string) => {
  console.log("Selected category:", category); // 👈 add this
  setIsOpen(false);

  if (category === "Video") {
    console.log("Navigating to /dashboard/add-video"); // 👈 add this
    navigate("/dashboard/products/add-video");
  } else if (category === "Music") {
    navigate("/dashboard/products/add-music");
  } else if (category === "Course") {
    navigate("/dashboard/products/add-course");
  } else if (category === "Podcasts") {
    navigate("/dashboard/products/add-podcast");
  } else if (category === "Ebook") {
    navigate("/dashboard/products/add-ebook");
  } else if (category === "Arts") {
    navigate("/dashboard/products/add-arts");
  }
};


  //const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <>
      {/* Product Submission Queue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between  mb-4 gap-4">
        <div>
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] leading-[130%] capitalize mb-0.5">
            Product List
          </h2>
          <p className="text-[#665B5B] font-['Open_Sans'] font-normal text-[14px] leading-[115%] mt-1 max-w-[700px]">
            View and manage all your uploaded products in one place. To add a
            new product, click the <strong>“Add Product”</strong> button.
          </p>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="
            w-[90vw]        // Button will stretch to 90% viewport width on mobile, always fits
            max-w-[320px]   // Never wider than 320px anywhere (desktop/tablet max)
            sm:w-auto       // On small screens and up, auto width (just enough for its content)
            flex items-center justify-center gap-2
            bg-[#7077FE] hover:bg-[#665EE0]
            text-white font-semibold rounded-lg shadow-sm transition-all
            text-xs         // Small font on tiny screens
            px-4 py-2       // Compact padding on mobile
            sm:text-sm sm:px-5 sm:py-2.5
          "
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>

      
      </div>
        

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  P.No
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Thumbnail
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Course Name
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Price
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Category
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Uploaded Date
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Status
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            {queue.map((product, idx) => (
  <ProductRow key={idx} {...product} />
))}
          </tbody>
          </table>
        </div>
        
    <div className="flex justify-end mt-10">
        <Pagination currentPage={1} totalPages={4} />
      </div>

    <CategoryModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={handleSelectCategory}
/>
        
       
    </>
  );
};

export default SellerProductList;
