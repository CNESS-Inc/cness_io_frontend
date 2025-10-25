import React from "react";
import Header from "../components/MarketPlace/Marketheader";
import { Trash2, Heart, Star, ClockFading, Video,ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
    const navigate = useNavigate();

  const cartItems = [
    {
      id: 1,
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      rating: 4.8,
      reviews: 123,
      duration: "00:23:00",
      originalPrice: 2444,
      currentPrice: 1259,
      discount: 50,
    },
    {
      id: 2,
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      category: "Course",
      mood: "🕊️ Peaceful",
      rating: 4.8,
      reviews: 123,
      duration: "00:23:00",
      originalPrice: 2444,
      currentPrice: 1259,
      discount: 50,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ===== PAGE CONTAINER ===== */}
      <div className="w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* ===== LEFT: CART ITEMS SECTION ===== */}
        <div className="flex-1">
          {/* Header row: Cart + Select all */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[20px] font-semibold text-[#1A1A1A] font-[Poppins]">
              Cart
            </h1>

            <label className="flex items-center gap-2 text-sm text-[#A7A6A6] cursor-pointer">
              <span>Select all</span>
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#7077FE] cursor-pointer"
              />
            </label>
          </div>

          {/* CART ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-[220px] h-[130px] object-cover rounded-lg"
                />

                {/* Product Info */}
                <div className="flex-1 space-y-1">
                  <h2 className="text-[#1A1A1A] text-[16px] font-semibold leading-tight font-[Poppins]">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-sm">{item.author}</p>

                  <div className="flex items-center flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Video className="w-5 h-5 mr-1 text-black" />
                      {item.category}
                    </span>
                    <span>{item.mood}</span>
                    <span className="flex items-center gap-1 text-[#7077FE] font-medium">
                      <Star className="w-4 h-4 text-[#7077FE]" fill="#7077FE" />
                      {item.rating} ({item.reviews})
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                      <ClockFading className="w-4 h-4 text-[#7077FE]" />
                      {item.duration}
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-gray-400 line-through text-sm">
                      ${item.originalPrice}
                    </span>
                    <span className="text-[#1A1A1A] font-semibold text-[16px]">
                      ${item.currentPrice}
                    </span>
                    <span className="text-[#7077FE] text-sm">
                      ({item.discount}%)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#7077FE] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT: PRICE DETAILS ===== */}
        <div className="w-full lg:w-[340px] h-fit relative mt-7">
          {/* Title floating above box */}
          <h2 className="absolute -top-6 left-3 text-[16px] font-semibold text-[#1A1A1A] font-[Poppins]">
            Price Details
          </h2>

          {/* Box */}
          <div className="bg-[#F9F9F9] shadow-md rounded-xl p-6 pt-10 mt-5">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal (2)</span>
                <span>$4998</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>$01</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount (10%)</span>
                <span>- $2498</span>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              <div className="flex justify-between font-semibold text-[16px] text-[#1A1A1A]">
                <span>Total</span>
                <span>$2518</span>
              </div>
            </div>

            <button 
            onClick={() => navigate(`/dashboard/checkout`)}
            className="mt-6 w-full bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#5E65F6] transition-colors">
              <ShoppingCart className="w-5 h-5 inline-block mr-2" />
               Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
