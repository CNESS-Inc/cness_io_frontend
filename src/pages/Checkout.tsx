import React, { useEffect, useState } from "react";
import {  CheckCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreateCheckoutSession, GetProductCart } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const DonationModal = ({ setShowDonationModal }: { setShowDonationModal: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-[#7077FE] to-[#5E65F6] p-8 rounded-t-3xl">
        <button
          onClick={() => setShowDonationModal(false)}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-[Poppins] font-bold text-[28px] text-white mb-2">
            Make a Difference Today
          </h2>
          <p className="text-white/90 font-[Open_Sans] text-[15px]">
            Your generosity creates lasting change in communities worldwide
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#7077FE] font-[Poppins]">12,847</div>
              <div className="text-sm text-gray-600 font-[Open_Sans] mt-1">Active Donors</div>
            </div>
            <div className="border-l border-r border-blue-200">
              <div className="text-3xl font-bold text-[#7077FE] font-[Poppins]">$2.4M</div>
              <div className="text-sm text-gray-600 font-[Open_Sans] mt-1">Total Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7077FE] font-[Poppins]">45K+</div>
              <div className="text-sm text-gray-600 font-[Open_Sans] mt-1">Lives Impacted</div>
            </div>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 hover:border-[#7077FE] hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#7077FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-[Poppins] font-semibold text-[16px] text-[#1A1A1A] mb-2">
                  Empower Communities
                </h4>
                <p className="text-gray-600 font-[Open_Sans] text-[13px] leading-relaxed">
                  Support education, healthcare, and essential resources for underprivileged families worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-2 border-green-100 rounded-2xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-[Poppins] font-semibold text-[16px] text-[#1A1A1A] mb-2">
                  100% Transparent
                </h4>
                <p className="text-gray-600 font-[Open_Sans] text-[13px] leading-relaxed">
                  Every dollar is tracked and verified. Receive detailed impact reports on how your donation helps
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-[Poppins] font-semibold text-[16px] text-[#1A1A1A] mb-2">
                  Earn Karma Credits ✨
                </h4>
                <p className="text-gray-600 font-[Open_Sans] text-[13px] leading-relaxed">
                  Build your Karma score and unlock exclusive rewards, badges, and community recognition
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-[Poppins] font-semibold text-[16px] text-[#1A1A1A] mb-2">
                  Instant Impact
                </h4>
                <p className="text-gray-600 font-[Open_Sans] text-[13px] leading-relaxed">
                  Donations are deployed immediately to urgent causes. See real-time updates on your contribution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-[Poppins] font-semibold text-[15px] text-[#1A1A1A]">
              Your Trust & Security Guaranteed
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: "🔒", text: "Bank-level encryption for all transactions" },
              { icon: "📊", text: "Quarterly transparency & impact reports" },
              { icon: "🏆", text: "Certified by leading charity watchdogs" },
              { icon: "💳", text: "Tax-deductible receipts provided instantly" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[13px] text-gray-700 font-[Open_Sans]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#7077FE]/5 to-purple-50 rounded-2xl p-6 text-center border-2 border-dashed border-[#7077FE]/30">
          <p className="text-[15px] text-gray-700 font-[Open_Sans] mb-4">
            Join our community of changemakers making the world better, one donation at a time
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-5">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7077FE] to-purple-400 border-2 border-white" />
              ))}
            </div>
            <span className="font-[Open_Sans]">and <strong className="text-[#7077FE]">12,843 others</strong> donated this month</span>
          </div>
          <button
            onClick={() => setShowDonationModal(false)}
            className="bg-gradient-to-r from-[#7077FE] to-[#5E65F6] text-white px-10 py-3.5 rounded-xl font-[Poppins] font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Got It, Let's Make an Impact! 💙
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isDonationEnabled, setIsDonationEnabled] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [appliedDonation, setAppliedDonation] = useState<number>(0);

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

  const handleAddDonation = () => {
    const amount = parseFloat(donationAmount);

    if (!donationAmount.trim()) {
      showToast({
        message: "Please enter a donation amount",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (amount <= 0) {
      showToast({
        message: "Donation amount must be greater than zero",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (amount > 10000) {
      showToast({
        message: "Maximum donation amount is $10,000",
        type: "error",
        duration: 2000,
      });
      return;
    }

    setAppliedDonation(amount);
    showToast({
      message: `Thank you! $${amount.toFixed(2)} donation added 💙`,
      type: "success",
      duration: 3000,
    });
  };

  const handleRemoveDonation = () => {
    setAppliedDonation(0);
    setDonationAmount("");
    setIsDonationEnabled(false);
    showToast({
      message: "Donation removed",
      type: "info",
      duration: 2000,
    });
  };

  const calculateFinalTotal = () => {
    const baseTotal = parseFloat(summary.total_amount || "0");
    return (baseTotal + appliedDonation).toFixed(2);
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
                    {/* <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      className="p-2 hover:bg-red-50 rounded-full transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button> */}
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

            {appliedDonation > 0 && (
              <div className="flex justify-between items-center text-[#7077FE] bg-blue-50 -mx-2 px-2 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Donation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${appliedDonation.toFixed(2)}</span>
                  <button
                    onClick={handleRemoveDonation}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove donation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 my-3"></div>

            <div className="flex justify-between font-semibold text-[16px] text-[#1A1A1A]">
              <span>Total</span>
              <span>${calculateFinalTotal()}</span>
            </div>
          </div>

          {/* Donation Section */}
          <div className="mt-5 flex items-start gap-2">
            <input
              type="checkbox"
              id="donation"
              checked={isDonationEnabled}
              onChange={(e) => {
                setIsDonationEnabled(e.target.checked);
                if (!e.target.checked) {
                  setDonationAmount("");
                  setAppliedDonation(0);
                }
              }}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#7077FE] focus:ring-2 focus:ring-[#7077FE] cursor-pointer"
            />
            <label htmlFor="donation" className="flex-1 text-sm text-gray-700 font-[Open_Sans]">
              <span className="font-medium text-[#1A1A1A]">Give Hope, Make Change</span> - Support those in need by donating.
              <button
                onClick={() => setShowDonationModal(true)}
                className="text-[#7077FE] hover:text-[#5E65F6] underline ml-1 font-medium"
              >
                Why Donate?
              </button>
            </label>
          </div>

          {/* Donation Amount Field */}
          {isDonationEnabled && appliedDonation === 0 && (
            <div className="mt-3 ml-6">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#7077FE] transition">
                  <span className="text-sm text-gray-600 pl-3">$</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    step="0.01"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddDonation();
                      }
                    }}
                    className="flex-1 px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleAddDonation}
                  className="bg-[#7077FE] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5E65F6] transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Min: $1 • Max: $10,000
              </p>
            </div>
          )}

          {appliedDonation > 0 && (
            <div className="mt-3 ml-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium">
                  Donation Added! 🎉
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Thank you for making a difference!
                </p>
              </div>
            </div>
          )}

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

      {showDonationModal && <DonationModal setShowDonationModal={setShowDonationModal} />}
    </div>
  );
};

export default CheckoutPage;
