/**
 * Marketplace Route Constants
 *
 * Centralized route management for the marketplace feature.
 * Update routes here and they'll automatically update throughout the app.
 *
 * Usage:
 * - For static routes: BUYER_ROUTES.HOME
 * - For dynamic routes: BUYER_ROUTES.PRODUCT_DETAIL('123')
 */

// ========================================
// BASE PATHS
// ========================================
const DASHBOARD_BASE = "/dashboard";
const MARKETPLACE_BASE = `${DASHBOARD_BASE}/new-marketplace`;

// ========================================
// BUYER ROUTES
// ========================================
export const BUYER_ROUTES = {
  // Static routes
  HOME: MARKETPLACE_BASE,
  PRODUCTS: `${MARKETPLACE_BASE}/products`,
  CART: `${MARKETPLACE_BASE}/cart`,
  CHECKOUT: `${MARKETPLACE_BASE}/checkout`,
  ORDERS: `${MARKETPLACE_BASE}/orders`,
  WISHLIST: `${MARKETPLACE_BASE}/wishlist`,
  SEARCH: `${MARKETPLACE_BASE}/search`,

  // Dynamic routes (helper functions)
  PRODUCT_DETAIL: (id: string) => `${MARKETPLACE_BASE}/product/${id}`,
  ORDER_DETAIL: (id: string) => `${MARKETPLACE_BASE}/orders/${id}`,
  CATEGORY: (categoryId: string) => `${MARKETPLACE_BASE}/category/${categoryId}`,
  SHOP: (shopId: string) => `${MARKETPLACE_BASE}/shop/${shopId}`,
} as const;

// ========================================
// SELLER ROUTES
// ========================================
const SELLER_BASE = `${MARKETPLACE_BASE}/seller`;

export const SELLER_ROUTES = {
  // Static routes
  DASHBOARD: SELLER_BASE,
  PRODUCTS: `${SELLER_BASE}/products`,
  ADD_PRODUCT: `${SELLER_BASE}/add-product`,
  ORDERS: `${SELLER_BASE}/orders`,
  ANALYTICS: `${SELLER_BASE}/analytics`,
  SETTINGS: `${SELLER_BASE}/settings`,
  EARNINGS: `${SELLER_BASE}/earnings`,

  // Dynamic routes (helper functions)
  EDIT_PRODUCT: (productId: string) => `${SELLER_BASE}/edit-product/${productId}`,
  ORDER_DETAIL: (orderId: string) => `${SELLER_BASE}/orders/${orderId}`,
  PRODUCT_PREVIEW: (productId: string) => `${SELLER_BASE}/preview/${productId}`,
} as const;

// ========================================
// ALL MARKETPLACE ROUTES (Combined)
// ========================================
export const MARKETPLACE_ROUTES = {
  BUYER: BUYER_ROUTES,
  SELLER: SELLER_ROUTES,
} as const;

// ========================================
// ROUTE PATTERNS (for react-router path definitions)
// Use these in your route configuration files
// ========================================
export const ROUTE_PATTERNS = {
  BUYER: {
    HOME: "new-marketplace",
    PRODUCTS: "products",
    CART: "cart",
    CHECKOUT: "checkout",
    ORDERS: "orders",
    WISHLIST: "wishlist",
    SEARCH: "search",
    PRODUCT_DETAIL: "product/:id",
    ORDER_DETAIL: "orders/:id",
    CATEGORY: "category/:categoryId",
    SHOP: "shop/:shopId",
  },
  SELLER: {
    DASHBOARD: "seller",
    PRODUCTS: "products",
    ADD_PRODUCT: "add-product",
    ORDERS: "orders",
    ANALYTICS: "analytics",
    SETTINGS: "settings",
    EARNINGS: "earnings",
    EDIT_PRODUCT: "edit-product/:productId",
    ORDER_DETAIL: "orders/:orderId",
    PRODUCT_PREVIEW: "preview/:productId",
  },
} as const;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if the current pathname is a marketplace route
 */
export const isMarketplaceRoute = (pathname: string): boolean => {
  return pathname.startsWith(MARKETPLACE_BASE);
};

/**
 * Check if the current pathname is a buyer route
 */
export const isBuyerRoute = (pathname: string): boolean => {
  return pathname.startsWith(MARKETPLACE_BASE) && !pathname.includes("/seller");
};

/**
 * Check if the current pathname is a seller route
 */
export const isSellerRoute = (pathname: string): boolean => {
  return pathname.includes(`${MARKETPLACE_BASE}/seller`);
};

/**
 * Get the base marketplace path
 */
export const getMarketplaceBase = (): string => {
  return MARKETPLACE_BASE;
};

/**
 * Get the seller base path
 */
export const getSellerBase = (): string => {
  return SELLER_BASE;
};

// ========================================
// TYPE EXPORTS (for TypeScript)
// ========================================
export type BuyerRouteKey = keyof typeof BUYER_ROUTES;
export type SellerRouteKey = keyof typeof SELLER_ROUTES;
