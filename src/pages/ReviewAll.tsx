import { useLocation } from 'react-router-dom';

import ProductCard from '../components/MarketPlace/ProductCard';
import sort from '../assets/bx_sort.svg';
import { ChevronDown } from "lucide-react";
import Pagination from '../components/MarketPlace/Pagination';

const ReviewAll: React.FC = () => {

  const location = useLocation();
  //const navigate = useNavigate();
  let product = location.state?.product;

  if (!product) {
    const storedProduct = localStorage.getItem("selectedProduct");
    if (storedProduct) product = JSON.parse(storedProduct);
  }
  const reviews = [
    {
      avatar: "https://static.codia.ai/image/2025-10-16/e90dgbfC6H.png",
      name: "Ava cooper",
      review:
        "Very detailed and practical. Every module has something new to learn. The downloadable files really helped me practice along.",
      tags: ["Focused", "Emotional"],
    },
    {
      avatar: "https://static.codia.ai/image/2025-10-16/Csvn95atK4.png",
      name: "Ava cooper",
      review:
        "Very detailed and practical. Every module has something new to learn. The files really helped me practice along.",
      tags: ["Focused", "Emotional"],
    },
    {
      avatar: "https://static.codia.ai/image/2025-10-16/cajFdMaey3.png",
      name: "Ava cooper",
      review:
        "Very detailed and practical. Every module has something new to learn. The files really helped me practice along.",
      tags: ["Focused", "Emotional"],
    },
  ];

  const ratingData = [
    { stars: 5, percentage: 60 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 7 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-8">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
        {/* Rating Summary Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-2xl p-6 mb-8 gap-6">

          {/* Left: Rating number + text */}
          <div className="flex flex-col items-center justify-center text-center w-full sm:w-[180px]">
            <h2 className="font-['Poppins'] font-semibold text-[40px] leading-[100%] text-[#1A1A1A]">
              {product?.rating || '0.0'}
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] leading-[100%] text-[#848484] mt-2">
              Based on{" "}
              <strong className="font-semibold text-[#848484]">
                {product?.reviews || 0} reviews
              </strong>
            </p>
          </div>

          {/* Middle: Rating bars */}
          <div className="flex-1 space-y-3 w-full sm:w-auto">
            {ratingData.map((rating, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center w-[40px] shrink-0">
                  <span className="text-[#7077FE] text-sm font-semibold">{rating.stars}</span>
                  <img
                    src="https://static.codia.ai/image/2025-10-16/g9soS0qbLX.png"
                    alt="Star"
                    className="w-4 h-4 ml-1"
                  />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden ">
                  <div
                    className="bg-[#F8B814] h-2 rounded-full absolute top-0 left-0 "
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 text-xs w-[80px] text-right-8">
                  {rating.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Right: Sort dropdown */}
          <div className="w-full sm:w-[140px] flex justify-end">
            <div className="relative w-full sm:w-auto">
              {/* Icon */}
              <img
                src={sort}
                alt="Sort Icon"
                className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />

              {/* Select Dropdown */}
              <select
                className="
        border border-gray-300 rounded-full 
        pl-10 pr-6 py-3 
        text-sm text-gray-600 
        focus:outline-none 
        appearance-none w-full sm:w-auto
      "
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Most Helpful</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />

            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-3 flex-wrap">
                {review.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <Pagination currentPage={1} totalPages={4} onPageChange={() => { }} />
        </div>
      </div>

      {/* ===== RIGHT PRODUCT CARD ===== */}
      <div className="w-full lg:w-[380px] h-fit">
        {product ? (
          <ProductCard product={product} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center text-gray-500">
            No product selected
          </div>
        )}
      </div>


    </div>

  );
};

export default ReviewAll;
