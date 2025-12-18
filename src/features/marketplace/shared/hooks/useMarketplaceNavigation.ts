/**
 * Marketplace Navigation Hook
 *
 * Provides type-safe navigation functions for the marketplace feature.
 * Use this hook for programmatic navigation (after button clicks, API calls, etc.)
 *
 * Usage:
 * const { goToProducts, goToProductDetail } = useMarketplaceNavigation();
 *
 * // Navigate to static route
 * goToProducts();
 *
 * // Navigate to dynamic route
 * goToProductDetail('product-123');
 */

import { useNavigate, useLocation, NavigateOptions } from "react-router-dom";
import { BUYER_ROUTES, SELLER_ROUTES } from "../constants/routes";

export const useMarketplaceNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ========================================
  // BUYER NAVIGATION
  // ========================================

  const goToHome = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.HOME, options);
  };

  const goToProducts = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.PRODUCTS, options);
  };

  const goToCart = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.CART, options);
  };

  const goToCheckout = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.CHECKOUT, options);
  };

  const goToOrders = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.ORDERS, options);
  };

  const goToWishlist = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.WISHLIST, options);
  };

  const goToSearch = (options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.SEARCH, options);
  };

  const goToProductDetail = (id: string, options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.PRODUCT_DETAIL(id), options);
  };

  const goToOrderDetail = (id: string, options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.ORDER_DETAIL(id), options);
  };

  const goToCategory = (categoryId: string, options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.CATEGORY(categoryId), options);
  };

  const goToShop = (shopId: string, options?: NavigateOptions) => {
    navigate(BUYER_ROUTES.SHOP(shopId), options);
  };

  // ========================================
  // SELLER NAVIGATION
  // ========================================

  const goToSellerDashboard = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.DASHBOARD, options);
  };

  const goToSellerProducts = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.PRODUCTS, options);
  };

  const goToAddProduct = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.ADD_PRODUCT, options);
  };

  const goToEditProduct = (productId: string, options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.EDIT_PRODUCT(productId), options);
  };

  const goToSellerOrders = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.ORDERS, options);
  };

  const goToSellerOrderDetail = (orderId: string, options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.ORDER_DETAIL(orderId), options);
  };

  const goToAnalytics = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.ANALYTICS, options);
  };

  const goToSellerSettings = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.SETTINGS, options);
  };

  const goToEarnings = (options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.EARNINGS, options);
  };

  const goToProductPreview = (productId: string, options?: NavigateOptions) => {
    navigate(SELLER_ROUTES.PRODUCT_PREVIEW(productId), options);
  };

  // ========================================
  // UTILITY NAVIGATION
  // ========================================

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const reload = () => {
    navigate(location.pathname, { replace: true });
  };

  // ========================================
  // RETURN ALL NAVIGATION FUNCTIONS
  // ========================================

  return {
    // Buyer navigation
    goToHome,
    goToProducts,
    goToCart,
    goToCheckout,
    goToOrders,
    goToWishlist,
    goToSearch,
    goToProductDetail,
    goToOrderDetail,
    goToCategory,
    goToShop,

    // Seller navigation
    goToSellerDashboard,
    goToSellerProducts,
    goToAddProduct,
    goToEditProduct,
    goToSellerOrders,
    goToSellerOrderDetail,
    goToAnalytics,
    goToSellerSettings,
    goToEarnings,
    goToProductPreview,

    // Utility
    goBack,
    goForward,
    reload,

    // Current location info
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash,
    locationState: location.state,
  };
};

// ========================================
// TYPE EXPORTS
// ========================================
export type MarketplaceNavigation = ReturnType<typeof useMarketplaceNavigation>;
