import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Clock, Globe, Target, Monitor, Play } from "lucide-react";

const SellerOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const order = state;

  if (!order) {
    return (
      <div className="p-10 text-center  h-screen flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-4 text-lg">
          No order details found for <span className="font-semibold">{id}</span>.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg bg-[#7077FE] text-white hover:bg-[#5A64E2] transition font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-6 lg:p-2 space-y-6">
      {/* Header Row: Breadcrumb + Back button */}
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span
            className="cursor-pointer hover:text-[#7077FE] transition"
            onClick={() => navigate(-1)}
          >
            Order list
          </span>
          <span>›</span>
          <span className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#8A8A8A]">{order.productName}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="border border-[#D1D5DB]  bg-white rounded-lg text-[#7077FE] px-5 py-2 text-sm font-medium hover:bg-[#7077FE] hover:text-white transition"
        >
          Back
        </button>
      </div>

      {/* Title */}
<h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-[#242E3A] capitalize">
        Order Details
      </h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Summary */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] capitalize ">
            Product Summary
          </h3>

          <div className="flex items-center gap-4 mb-5 mt-4">
            <img
              src={order.thumbnail}
              alt="Product Thumbnail"
              className="w-[80px] h-[60px] rounded-md object-cover border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-800 text-[15px] leading-snug">
                {order.productName}
              </p>
              <p className="text-sm text-gray-500">by Redtape</p>
            </div>
          </div>

          <h4 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2 mt-4">
            Details
          </h4>

          <ul className="space-y-2 text-[14px] text-gray-600 mt-5">
  {[
    { icon: <Clock className="w-4 h-4 text-[#7077FE]" />, label: "Duration", value: "12 hours" },
    { icon: <Target className="w-4 h-4 text-[#7077FE]" />, label: "Skill Level", value: "Beginner → Advanced" },
    { icon: <Globe className="w-4 h-4 text-[#7077FE]" />, label: "Language", value: "English (with subtitles)" },
    { icon: <Play className="w-4 h-4 text-[#7077FE]" />, label: "Format", value: "Video" },
    {
      icon: <Monitor className="w-4 h-4 text-[#7077FE]" />,
      label: "Requirements",
      value: "Basic computer with drawing tablet or mouse",
    },
  ].map((item, index) => (
    <li key={index} className="grid grid-cols-[24px_160px_1fr] items-start gap-2">
      {item.icon}
      <span className="font-['Poppins'] text-[14px] text-[#000000]">{item.label}</span>
      <span className="font-['Poppins'] text-[14px] text-[#000000]">{item.value}</span>
    </li>
  ))}
</ul>
        </div>

        {/* Right: Payment Summary */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit">
          <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-4">
            Payment Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">Subtotal</span>
              <span className="font-['Open_Sans'] font-semibold text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">$4998</span>
            </div>
            <div className="flex justify-between">
              <span className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">Platform Fee</span>
              <span className="font-['Open_Sans'] font-semibold text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">$1</span>
            </div>
            <div className="flex justify-between">
              <span className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">Discount (10%)</span>
              <span className="text-red-500 font-medium">-$2498</span>
            </div>

            <hr className="my-3 border-gray-200" />

            <div className="flex justify-between font-['Open_Sans'] text-[14px] font-semibold text-[#1A1A1A]">
              <span>Total</span>
              <span className="font-['Open_Sans'] font-bold text-[14px] leading-[26px] tracking-[0] text-[#1A1A1A]">$2518</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => alert("Order cancelled!")}
              className="px-4 py-2 border border-[#7077FE] text-[#7077FE] rounded-md text-sm font-medium hover:bg-[#7077FE] hover:text-white transition"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetail;
