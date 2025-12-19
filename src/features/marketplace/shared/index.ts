/**
 * Marketplace Shared Utilities - Main Export
 *
 * This file exports all shared utilities for easy importing.
 *
 * Usage:
 * import { BUYER_ROUTES, useMarketplaceNavigation, MarketplaceLink } from '@/features/marketplace/shared';
 */

// ========================================
// ROUTE CONSTANTS
// ========================================
export {
  BUYER_ROUTES,
  SELLER_ROUTES,
  MARKETPLACE_ROUTES,
  ROUTE_PATTERNS,
  isMarketplaceRoute,
  isBuyerRoute,
  isSellerRoute,
  getMarketplaceBase,
  getSellerBase,
} from "./constants/routes";

export type { BuyerRouteKey, SellerRouteKey } from "./constants/routes";

// ========================================
// NAVIGATION HOOK
// ========================================
export { useMarketplaceNavigation } from "./hooks/useMarketplaceNavigation";

export type { MarketplaceNavigation } from "./hooks/useMarketplaceNavigation";

// ========================================
// COMPONENTS
// ========================================
export {
  MarketplaceLink,
  MarketplaceButtonLink,
  ExternalLink,
} from "./components/MarketplaceLink";

// ========================================
// ROUTE HELPERS
// ========================================
export {
  getRouteParams,
  getProductIdFromPath,
  getOrderIdFromPath,
  getShopIdFromPath,
  getCategoryIdFromPath,
  buildUrlWithParams,
  parseQueryParams,
  updateQueryParams,
  isProductDetailRoute,
  isOrderDetailRoute,
  isSellerProductRoute,
  isSellerOrderRoute,
  isCheckoutFlow,
  generateBreadcrumbs,
  shouldPreserveScroll,
  getPreviousRouteType,
  isValidUrl,
  isExternalUrl,
  matchesRoute,
  getActiveRouteKey,
} from "./utils/routeHelpers";
