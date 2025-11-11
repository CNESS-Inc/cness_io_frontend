import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreateCheckoutSession, GetProductCart, RemoveProductToCart } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await GetProductCart();
      const items = response?.data?.data?.cart_items || [];
      setSummary(response?.data?.data?.summary || {});
      setCartItems(items);

      // If cart is empty, redirect back
      if (items.length === 0) {
        showToast({
          message: "Your cart is empty",
          type: "error",
          duration: 3000,
        });
        navigate("/dashboard/cart");
      }
    } catch (error: any) {
      showToast({
        message: "Failed to load cart details",
        type: "error",
        duration: 3000,
      });
      navigate("/dashboard/cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await RemoveProductToCart(productId);
      showToast({
        message: "Item removed from cart",
        type: "success",
        duration: 2000,
      });
      fetchCartItems(); // Refresh cart
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to remove item",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast({
        message: "Please enter a coupon code",
        type: "error",
        duration: 2000,
      });
      return;
    }

    try {
      // For now, just show a message
      showToast({
        message: "Coupon applied successfully!",
        type: "success",
        duration: 2000,
      });
    } catch (error: any) {
      showToast({
        message: "Invalid coupon code",
        type: "error",
        duration: 2000,
      });
    }
  };

  // Handle Proceed to Payment
  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      showToast({
        message: "Your cart is empty",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await CreateCheckoutSession();

      // Get the Stripe checkout URL
      const checkoutUrl = response?.data?.data?.checkout_url;

      if (checkoutUrl) {
        // Redirect to Stripe payment page
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Failed to proceed to payment",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
            Product Summary ({cartItems.length})
          </h2>

          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            {isLoading && (
              <LoadingSpinner />
            )}
            {cartItems?.length ?
              cartItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail_url || "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png"}
                      alt={item.product_name}
                      className="w-[120px] h-[70px] rounded-lg object-cover cursor-pointer"
                      onClick={() => navigate(`/dashboard/product-detail/${item.product_id}`)}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1A1A] font-[Poppins]">
                        {item.product_name}
                      </h3>
                      <p className="text-gray-500 text-xs"> by {item.shop_name || "Unknown"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-red-50 rounded-full transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <span className="font-semibold text-[#1A1A1A]">
                      ${item.discounted_price}
                    </span>
                  </div>
                </div>
              )) : (
                !isLoading && (
                  <p className="text-gray-500 text-center py-10">No items in the cart.</p>
                )
              )}
          </div>
        </div>

        {/* Right: Price Details */}
        <div className="w-full lg:w-[340px] h-fit bg-[#F9F9F9] shadow-md rounded-xl p-6">
          <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-4 font-[Poppins]">
            Price Details
          </h2>

          <div className="space-y-3 text-sm text-gray-700 font-[Poppins]">
            <div className="flex justify-between">
              <span>Subtotal ({summary.total_products || 0})</span>
              <span>${summary.subtotal || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>${summary.platform_fee || "0.00"}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ${summary.total_discount}</span>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            <div className="flex justify-between font-semibold text-[16px] text-[#1A1A1A]">
              <span>Total</span>
              <span>${summary.total_amount || "0.00"}</span>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="flex items-center gap-2 mt-6">
            <input
              type="text"
              placeholder="Apply coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7077FE]"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-[#7077FE] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#5E65F6] transition"
            >
              Apply
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing || cartItems.length === 0}
            className={`mt-6 w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${isProcessing || cartItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#7077FE] hover:bg-[#5E65F6]"
              } text-white`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>

  );
};

export default CheckoutPage;
