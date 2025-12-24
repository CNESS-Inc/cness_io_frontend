import { lazy } from "react";
import ComingSoon from "../pages/ComingSoon";

// Layout components (create these if needed)
 import MarketplaceLayout from "../features/marketplace/shared/layout/Marketplacelayout";
import Recommendation from "../features/marketplace/buyer/pages/Recommendation";
import PaymentSuccess from "../features/marketplace/buyer/pages/PaymentSuccess.tsx";
import PaymentFailed from "../features/marketplace/buyer/pages/PaymentFail.tsx";
//import OrderHistory from "../features/marketplace/buyer/pages/OrderHistory";
// import SellerLayout from "../layout/Marketplace/SellerLayout";

// Buyer Pages - Lazy loaded
const MarketplaceHome = lazy(() => import("../features/marketplace/buyer/pages/MarketplaceHome"));
// const Categories = lazy(() => import("../features/marketplace/buyer/pages/Categories"));
const Curators = lazy(() => import("../features/marketplace/buyer/pages/Curators"));
const CuratorsDetail = lazy(() => import("../features/marketplace/buyer/pages/CuratorsDetail.tsx"));
// const BuyerProductDetail = lazy(() => import("../pages/ComingSoon"));
const MarketplaceCategories = lazy(() => import("../features/marketplace/buyer/pages/MarketplaceCategories"));
const MarketProductDetail = lazy(() => import("../features/marketplace/buyer/pages/MarketProductDetail"));
const BuyerCart = lazy(() => import("../features/marketplace/buyer/pages/BuyerCart"));
const BuyerCheckout = lazy(() => import("../pages/ComingSoon"));
const OrderHistory = lazy(() => import("../features/marketplace/buyer/pages/OrderHistory"));


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
   element: <MarketplaceLayout />, // Optional: Add layout wrapper if needed
  children: [
    // ========================================
    // BUYER ROUTES (No /buyer prefix)
    // ========================================
    {
      index: true,
      element: <MarketplaceHome />,
    },
    {
      path: "categories",
      element: <MarketplaceCategories />,
    },
       {
     path: "curators",
     element: <Curators />,
   },
   {
     path: "curator/:id",
     element: <CuratorsDetail />,
   },
    {
      path: "categories/product/:id",
      element: <MarketProductDetail />,
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
      path: "ordershistory",
      element: <OrderHistory />,
    },
    {
      path: "wishlist",
      element: <ComingSoon />,
    },
    {
      path: "search",
      element: <ComingSoon />,
    },
    {
      path:"recommendation",
       element: <Recommendation />,
    },
    {
      path :"payment-success",
      element: <PaymentSuccess />,
    },
    {
      path :"payment-fail",
      element: <PaymentFailed />,
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
