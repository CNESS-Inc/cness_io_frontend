import React, { useState, useEffect } from "react";
import { Trash2, Video, ShoppingCart, Star, ClockFading, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AddProductToWishlist,
  CreateCheckoutSession,
  GetProductCart,
  RemoveProductToCart,
  RemoveProductToWishlist
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useCartWishlist } from "../components/MarketPlace/context/CartWishlistContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateCartCount, updateWishlistCount, decrementCart } = useCartWishlist();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  // console.log('cartItems', cartItems)
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  // const [selectAll, setSelectAll] = useState(false);

  // Fetch cart items
  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await GetProductCart();
      console.log('response', response)
      const items = response?.data?.data?.cart_items || [];
      setSummary(response?.data?.data?.summary || {});
      setCartItems(items);

      await updateCartCount();
    } catch (error: any) {
      showToast({
        message: "Failed to load cart",
        type: "error",
        duration: 3000,
      });
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle Remove from Cart
  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await RemoveProductToCart(cartItemId);
      showToast({
        message: "Item removed from cart",
        type: "success",
        duration: 2000,
      });
      decrementCart();
      fetchCartItems(); // Refresh cart

      // Remove from selected items if it was selected
      // setSelectedItems(prev => {
      //   const newSet = new Set(prev);
      //   newSet.delete(cartItemId);
      //   return newSet;
      // });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to remove item",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle Add/Remove from Wishlist
  const handleWishlistToggle = async (item: any) => {
    try {
      if (item?.is_in_wishlist) {
        await RemoveProductToWishlist(item.product_id);
        showToast({
          message: "Removed from wishlist",
          type: "success",
          duration: 2000,
        });
      } else {
        await AddProductToWishlist({ product_id: item.product_id });
        showToast({
          message: "Added to wishlist ❤️",
          type: "success",
          duration: 2000,
        });
      }

      await updateWishlistCount();
      fetchCartItems(); // Refresh to update wishlist status
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to update wishlist",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle Select Item
  // const handleSelectItem = (itemId: string) => {
  //   setSelectedItems(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(itemId)) {
  //       newSet.delete(itemId);
  //     } else {
  //       newSet.add(itemId);
  //     }
  //     return newSet;
  //   });
  // };

  // Handle Select All
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedItems(new Set());
  //   } else {
  //     setSelectedItems(new Set(cartItems.map(item => item.id)));
  //   }
  //   setSelectAll(!selectAll);
  // };

  // Update selectAll state when individual items change
  // useEffect(() => {
  //   setSelectAll(cartItems.length > 0 && selectedItems.size === cartItems.length);
  // }, [selectedItems, cartItems]);

  // Calculate Price Details
  // const calculatePriceDetails = () => {
  //   const selectedCartItems = Array.isArray(cartItems)
  //     ? cartItems.filter(item => selectedItems.has(item.cart_id))
  //     : [];

  //   const subtotal = selectedCartItems.reduce((sum, item) => {
  //     return sum + (parseFloat(item.price) * item.quantity);
  //   }, 0);

  //   const platformFee = 1; // Fixed platform fee

  //   const discountAmount = selectedCartItems.reduce((sum, item) => {
  //     const originalPrice = parseFloat(item.price);
  //     const finalPrice = parseFloat(item.discounted_price);
  //     return sum + ((originalPrice - finalPrice) * item.quantity);
  //   }, 0);

  //   const total = selectedCartItems.reduce((sum, item) => {
  //     return sum + (parseFloat(item.discounted_price) * item.quantity);
  //   }, 0) + platformFee;

  //   const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);

  //   return {
  //     subtotal: subtotal.toFixed(2),
  //     platformFee: platformFee.toFixed(2),
  //     discountAmount: discountAmount.toFixed(2),
  //     total: total.toFixed(2),
  //     totalItems,
  //   };
  // };

  // const priceDetails = calculatePriceDetails();

  // Handle Proceed to Checkout
  const handleProceedToCheckout = async () => {
    // if (selectedItems.size === 0) {
    //   showToast({
    //     message: "Please select at least one item to checkout",
    //     type: "error",
    //     duration: 3000,
    //   });
    //   return;
    // }
    navigate('/dashboard/checkout');
    return;
    setIsLoading(true);
    try {
      const response = await CreateCheckoutSession();

      // Get the Stripe session URL from response
      const checkoutUrl = response?.data?.data?.checkout_url;

      if (checkoutUrl) {
        // Redirect to Stripe checkout page
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Failed to proceed to checkout",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT: CART ITEMS SECTION */}
        <div className="flex-1">
          {/* Header row: Cart + Select all */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[20px] font-semibold text-[#1A1A1A] font-[Poppins]">
              Cart ({cartItems?.length})
            </h1>

            {/* {cartItems.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-[#A7A6A6] cursor-pointer">
                <span>Select all</span>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#7077FE] cursor-pointer"
                />
              </label>
            )} */}
          </div>

          {/* CART ITEMS */}
          {cartItems?.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Start adding products to your cart!</p>
              <button
                onClick={() => navigate('/dashboard/market-place')}
                className="mt-6 px-6 py-3 bg-[#7077FE] text-white rounded-lg hover:bg-[#5E65F6] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4"
                  >
                    {/* Product Image */}
                    <img
                      src={item?.thumbnail_url || "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png"}
                      alt={item.product_name}
                      className="w-[220px] h-[130px] object-cover rounded-lg cursor-pointer"
                      onClick={() => navigate(`/dashboard/product-detail/${item.product_id}`)}
                    />

                    {/* Product Info */}
                    <div className="flex-1 space-y-1">
                      <h2
                        className="text-[#1A1A1A] text-[16px] font-semibold leading-tight font-[Poppins] cursor-pointer hover:text-[#7077FE]"
                        onClick={() => navigate(`/dashboard/product-detail/${item.product_id}`)}
                      >
                        {item.product_name}
                      </h2>
                      <p className="text-gray-500 text-sm">by {item?.shop_name || "Unknown"}</p>

                      <div className="flex items-center flex-wrap gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Video className="w-5 h-5 mr-1 text-black" />
                          {item.category?.name || "Course"}
                        </span>
                        <span>
                          {item.mood?.icon || "🕊️"} {item.mood?.name || "Peaceful"}
                        </span>
                        <span className="flex items-center gap-1 text-[#7077FE] font-medium">
                          <Star className="w-4 h-4 text-[#7077FE]" fill="#7077FE" />
                          {item?.rating?.average} ({item?.rating?.total_reviews || 0})
                        </span>
                        {item.duration && (
                          <span className="flex items-center gap-1 text-sm text-gray-700">
                            <ClockFading className="w-4 h-4 text-[#7077FE]" />
                            {item.duration ||
                              item.duration ||
                              "00:00:00"}
                          </span>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center gap-2 mt-2">
                        {item?.discount_percentage > 0 && (
                          <span className="text-gray-400 line-through text-sm">
                            {item.price}
                          </span>
                        )}
                        <span className="text-[#1A1A1A] font-semibold text-[16px]">
                          {item.discounted_price}
                        </span>
                        {item.discount_percentage > 0 && (
                          <span className="text-[#7077FE] text-sm">
                            ({item.discount_percentage}%)
                          </span>
                        )}
                      </div>

                      {/* Quantity Display */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 ml-auto">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.product_id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleWishlistToggle(item)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${item.is_in_wishlist
                            ? "text-red-500 fill-red-500"
                            : "text-gray-500"
                            }`}
                        />
                      </button>

                      {/* Select Checkbox */}
                      {/* <input
                        type="checkbox"
                        checked={selectedItems.has(item.product_id)}
                        onChange={() => handleSelectItem(item.product_id)}
                        className="w-5 h-5 accent-[#7077FE] cursor-pointer"
                      /> */}
                    </div>
                  </div>
                )
              })}
            </div>
          )
          }
        </div>

        {/* RIGHT: PRICE DETAILS */}
        {cartItems?.length > 0 && (
          <div className="w-full lg:w-[340px] h-fit relative mt-7">
            {/* Title floating above box */}
            <h2 className="absolute -top-6 left-3 text-[16px] font-semibold text-[#1A1A1A] font-[Poppins]">
              Price Details
            </h2>

            {/* Box */}
            <div className="bg-[#F9F9F9] shadow-md rounded-xl p-6 pt-10 mt-5">
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({summary.total_products})</span>
                  <span>${summary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>${summary.platformFee || 0}</span>
                </div>
                {summary.total_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ${summary.total_discount}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 my-3"></div>

                <div className="flex justify-between font-semibold text-[16px] text-[#1A1A1A]">
                  <span>Total</span>
                  <span>${summary.total_amount}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                // disabled={selectedItems.size === 0}
                className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-[#7077FE] text-white hover:bg-[#5E65F6]`}
              >
                <ShoppingCart className="w-5 h-5" />
                Proceed to checkout
              </button>

              {/* {selectedItems.size === 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Select items to proceed
                </p>
              )} */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;