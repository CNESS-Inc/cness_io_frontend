import React from "react";
import Header from "../components/MarketPlace/Marketheader";
import { Trash2, CheckCircle, CreditCard, ShoppingCart } from "lucide-react";

const CheckoutPage: React.FC = () => {
  const cartItems = [
    {
      id: 1,
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      currentPrice: 1259,
    },
    {
      id: 2,
      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      currentPrice: 1259,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="w-full mx-auto px-6 py-8">
        {/* ===== Progress Bar ===== */}
        <div className="flex flex items-center justify-center gap-10 mb-10">
          {/* Checkout Step */}
          <div className="flex items-center gap-2">
  <div className="w-10 h-10 rounded-full bg-[#7077FE] flex items-center justify-center text-white">
    <ShoppingCart className="w-5 h-5" />
  </div>
  <p className="text-sm text-[#7077FE] font-medium">Checkout</p>
</div>

          {/* Dotted Line */}
          <div className="flex-1 max-w-[250px] border-t-2 border-dashed border-gray-300"></div>

          {/* Payment Step */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Payment</p>
          </div>

          {/* Dotted Line */}
          <div className="flex-1 max-w-[250px] border-t-2 border-dashed border-gray-300"></div>

          {/* Ordered Step */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm mt-2 text-gray-400 font-medium">Ordered</p>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Product Summary */}
          <div className="flex-1">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-4 font-[Poppins]">
              Product Summary
            </h2>

            <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-[120px] h-[70px] rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1A1A] font-[Poppins]">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs">{item.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-red-50 rounded-full transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <span className="font-semibold text-[#1A1A1A]">
                      ${item.currentPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Price Details */}
          <div className="w-full lg:w-[340px] h-fit bg-[#F9F9F9] shadow-md rounded-xl p-6">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-4 font-[Poppins]">
              Price Details
            </h2>

            <div className="space-y-3 text-sm text-gray-700 font-[Poppins]">
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

            {/* Coupon Input */}
            <div className="flex items-center gap-2 mt-6">
              <input
                type="text"
                placeholder="Apply coupon code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7077FE]"
              />
              <button className="bg-[#7077FE] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#5E65F6] transition">
                Apply
              </button>
            </div>

            {/* Continue Button */}
            <button className="mt-6 w-full bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#5E65F6] transition">
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
