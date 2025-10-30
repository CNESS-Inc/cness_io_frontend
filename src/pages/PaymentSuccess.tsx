import React from "react";
import Header from "../components/MarketPlace/Buyerheader";
import {  CheckCircle, ShoppingCart,Check, WalletCards} from "lucide-react";
import { useNavigate } from "react-router-dom";
import pay from "../assets/pay.svg";


const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
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
  <img src={pay} alt="payment" className="w-10 h-10"/>

            <p className="text-sm text-[#7077FE] font-medium">Payment</p>
          </div>

          {/* Dotted Line */}
          <div className="flex-1 max-w-[250px] border-t-2 border-dashed border-gray-300"></div>

          {/* Ordered Step */}
          <div className="flex items-center gap-2">
  <div className="w-10 h-10 rounded-full bg-[#5CB85C] flex items-center justify-center text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm mt-2 text-[#5CB85C] font-medium">Ordered</p>
          </div>
        </div>
</div>

 {/* ===== Success Icon ===== */}
<div className="flex flex-col items-center text-center">
  <div className="w-[120px] h-[120px] bg-[#5CB85C]/10 rounded-full flex items-center justify-center mb-6">

    <div className="w-[80px] h-[80px] bg-[#5CB85C] rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-white" />
          </div>
          </div>

          {/* ===== Success Message ===== */}
<h2 className="font-[Poppins] font-semibold text-[24px] leading-[100%] text-[#1A1A1A] text-center mb-4">
            Success! Your content is unlocked
          </h2>

         <p className="font-[Open_Sans] font-normal text-[14px] leading-[125%] text-[#848484] text-center max-w-md mb-8">
  Thank you for your purchase. Your digital product is now available
  in your Library — ready to watch anytime.
</p>

          {/* ===== Button ===== */}
          <button
  onClick={() => navigate("/library")}
  className="bg-[#7077FE] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 
             font-[Plus_Jakarta_Sans] font-medium text-[16px] leading-[100%] hover:bg-[#5E65F6] transition"
>
  <WalletCards className="w-5 h-5" />
  Watch in Library
</button>
        </div>

                </main>

 );
};
export default PaymentSuccess;