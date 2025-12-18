import { lazy } from "react";
import ComingSoon from "../pages/ComingSoon";

// Layout components (create these if needed)
// import MarketplaceLayout from "../layout/Marketplace/MarketplaceLayout";
// import SellerLayout from "../layout/Marketplace/SellerLayout";

// Buyer Pages - Lazy loaded
const MarketplaceHome = lazy(() => import("../features/marketplace/buyer/pages/MarketplaceHome"));
const BuyerProducts = lazy(() => import("../pages/ComingSoon"));
const BuyerProductDetail = lazy(() => import("../pages/ComingSoon"));
const BuyerCart = lazy(() => import("../pages/ComingSoon"));
const BuyerCheckout = lazy(() => import("../pages/ComingSoon"));
const BuyerOrders = lazy(() => import("../pages/ComingSoon"));

// Seller Pages - Lazy loaded (replace with your actual page paths)
const SellerDashboard = lazy(() => import("../pages/ComingSoon"));
const SellerProducts = lazy(() => import("../pages/ComingSoon"));
const SellerAddProduct = lazy(() => import("../pages/ComingSoon"));
const SellerEditProduct = lazy(() => import("../pages/ComingSoon"));
const SellerOrders = lazy(() => import("../pages/ComingSoon"));
const SellerAnalytics = lazy(() => import("../pages/ComingSoon"));

/**
 * Marketplace Routes
 *
 * Structure:
 * - Buyer routes: /new-marketplace/:anything (no /buyer prefix)
 * - Seller routes: /new-marketplace/seller/:anything
 */
export const marketplaceRoutes = {
  path: "new-marketplace",
  // element: <MarketplaceLayout />, // Optional: Add layout wrapper if needed
  children: [
    // ========================================
    // BUYER ROUTES (No /buyer prefix)
    // ========================================
    {
      index: true,
      element: <MarketplaceHome />,
    },
    {
      path: "products",
      element: <BuyerProducts />,
    },
    {
      path: "product/:id",
      element: <BuyerProductDetail />,
    },
    {
      path: "cart",
      element: <BuyerCart />,
    },
    {
      path: "checkout",
      element: <BuyerCheckout />,
    },
    {
      path: "orders",
      element: <BuyerOrders />,
    },
    {
      path: "wishlist",
      element: <ComingSoon />,
    },
    {
      path: "search",
      element: <ComingSoon />,
    },

    // ========================================
    // SELLER ROUTES (With /seller prefix)
    // ========================================
    {
      path: "seller",
      // element: <SellerLayout />, // Optional: Add seller-specific layout
      children: [
        {
          index: true,
          element: <SellerDashboard />,
        },
        {
          path: "products",
          element: <SellerProducts />,
        },
        {
          path: "add-product",
          element: <SellerAddProduct />,
        },
        {
          path: "edit-product/:productId",
          element: <SellerEditProduct />,
        },
        {
          path: "orders",
          element: <SellerOrders />,
        },
        {
          path: "orders/:orderId",
          element: <ComingSoon />,
        },
        {
          path: "analytics",
          element: <SellerAnalytics />,
        },
        {
          path: "settings",
          element: <ComingSoon />,
        },
        {
          path: "earnings",
          element: <ComingSoon />,
        },
      ],
    },
  ],
};
