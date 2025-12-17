import React, { useState } from "react";
import { ShoppingCart, X, RotateCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import pay from "../assets/pay.svg";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { RetryPayment } from "../Common/ServerAPI";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const orderId = location.state?.order_id;

  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryPayment = async () => {
    if (!orderId) {
      showToast({
        message: "Order ID not found. Please try again from cart.",
        type: "error",
        duration: 3000,
      });
      navigate("/dashboard/cart");
      return;
    }

    setIsRetrying(true);
    try {
      const response = await RetryPayment({ order_id: orderId });

      // Get new checkout URL from response
      const checkoutUrl =
        response?.data?.data?.checkout_url ||
        response?.data?.data?.session_url;

      if (checkoutUrl) {
        // Redirect to new Stripe payment session
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);

      const errorMsg =
        error?.response?.data?.error?.message ||
        "Failed to retry payment. Please try again.";

      showToast({
        message: errorMsg,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <>
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

            <img src={pay} alt="payment" className="w-10 h-10" />
            <p className="text-sm text-[#7077FE] font-medium">Payment</p>
          </div>

          {/* Dotted Line */}
          <div className="flex-1 max-w-[250px] border-t-2 border-dashed border-gray-300"></div>

          {/* Ordered Step */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FF0101] flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </div>
            <p className="text-sm mt-2 text-[#FF0101] font-medium">Failed</p>
          </div>
        </div>
      </div>

      {/* ===== Success Icon ===== */}
      <div className="flex flex-col items-center text-center">
        <div className="w-[120px] h-[120px] bg-[#FF0101]/10 rounded-full flex items-center justify-center mb-6">

          <div className="w-[80px] h-[80px] bg-[#FF0101] rounded-full flex items-center justify-center">
            <X className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* ===== Success Message ===== */}
        <h2 className="font-[Poppins] font-semibold text-[24px] leading-[100%] text-[#1A1A1A] text-center mb-4">
          Oops! Payment Failed — Let’s Try Again.
        </h2>

        <p className="font-[Open_Sans] font-normal text-[14px] leading-[125%] text-[#848484] text-center max-w-md mb-8">
          Check your payment details or try a different payment method..
        </p>

        {/* ===== Button ===== */}
        {orderId && (
          <button
            onClick={handleRetryPayment}
            disabled={isRetrying}
            className={`px-7 py-3 rounded-lg flex items-center justify-center gap-2 
                font-[Plus_Jakarta_Sans] font-medium text-[16px] leading-[100%] transition
                ${isRetrying
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#7077FE] text-white hover:bg-[#5E65F6]"
              }`}
          >
            <RotateCw className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Retrying..." : "Retry Payment"}
          </button>
        )}

        <button
          onClick={() => navigate("/dashboard/cart")}
          className="bg-white border border-[#5E65F6] text-[#5E65F6] px-6 py-3 rounded-lg 
             flex items-center justify-center gap-2 font-[Plus_Jakarta_Sans] font-medium 
             text-[16px] leading-[100%] hover:bg-[#5E65F6] hover:text-white transition mt-5"
        >
          <ShoppingCart className="w-5 h-5" />
          Go Back to Cart
        </button>
      </div>

    </>

  );
};
export default PaymentSuccess;