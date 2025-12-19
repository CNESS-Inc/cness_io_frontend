/**
 * Route Helper Functions
 *
 * Utility functions for working with marketplace routes.
 * Includes route checking, parameter extraction, and URL manipulation.
 *
 * Usage:
 * import { isBuyerRoute, getRouteParams } from './routeHelpers';
 *
 * if (isBuyerRoute(location.pathname)) {
 *   // Show buyer navigation
 * }
 */

import {
  BUYER_ROUTES,
  SELLER_ROUTES,
  isMarketplaceRoute,
  isBuyerRoute,
  isSellerRoute,
  getMarketplaceBase,
  getSellerBase,
} from "../constants/routes";

// Re-export route checking functions from constants for convenience
export {
  isMarketplaceRoute,
  isBuyerRoute,
  isSellerRoute,
  getMarketplaceBase,
  getSellerBase,
};

// ========================================
// ROUTE PARAMETER EXTRACTION
// ========================================

/**
 * Extract route parameters from a pathname
 * @param pathname - Current pathname
 * @param pattern - Route pattern (e.g., '/product/:id')
 * @returns Object with extracted parameters or null
 */
export const getRouteParams = (
  pathname: string,
  pattern: string
): Record<string, string> | null => {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
};

/**
 * Extract product ID from product detail route
 */
export const getProductIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/product\/([^/]+)/);
  return match ? match[1] : null;
};

/**
 * Extract order ID from order detail route
 */
export const getOrderIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/orders\/([^/]+)/);
  return match ? match[1] : null;
};

/**
 * Extract shop ID from shop route
 */
export const getShopIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/shop\/([^/]+)/);
  return match ? match[1] : null;
};

/**
 * Extract category ID from category route
 */
export const getCategoryIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/category\/([^/]+)/);
  return match ? match[1] : null;
};

// ========================================
// QUERY PARAMETER HELPERS
// ========================================

/**
 * Build a URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Object of query parameters
 * @returns URL with query string
 */
export const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, any>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Parse query parameters from a search string
 * @param search - Search string (e.g., '?page=1&sort=price')
 * @returns Object with parsed parameters
 */
export const parseQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

/**
 * Update query parameters in a URL
 * @param currentSearch - Current search string
 * @param updates - Parameters to update
 * @returns New search string
 */
export const updateQueryParams = (
  currentSearch: string,
  updates: Record<string, any>
): string => {
  const params = new URLSearchParams(currentSearch);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

// ========================================
// ROUTE TYPE CHECKING
// ========================================

/**
 * Check if a route is a product detail page
 */
export const isProductDetailRoute = (pathname: string): boolean => {
  return pathname.includes("/product/") && !pathname.includes("/products");
};

/**
 * Check if a route is an order detail page
 */
export const isOrderDetailRoute = (pathname: string): boolean => {
  return pathname.includes("/orders/") && pathname.split("/").length > 4;
};

/**
 * Check if a route is a seller product management page
 */
export const isSellerProductRoute = (pathname: string): boolean => {
  return isSellerRoute(pathname) && pathname.includes("/products");
};

/**
 * Check if a route is a seller order management page
 */
export const isSellerOrderRoute = (pathname: string): boolean => {
  return isSellerRoute(pathname) && pathname.includes("/orders");
};

/**
 * Check if current route is cart or checkout
 */
export const isCheckoutFlow = (pathname: string): boolean => {
  return pathname.includes("/cart") || pathname.includes("/checkout");
};

// ========================================
// BREADCRUMB HELPERS
// ========================================

/**
 * Generate breadcrumb items from pathname
 * @param pathname - Current pathname
 * @returns Array of breadcrumb items
 */
export const generateBreadcrumbs = (
  pathname: string
): Array<{ label: string; path: string }> => {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];

  let currentPath = "";

  parts.forEach((part) => {
    currentPath += `/${part}`;

    // Format the label (capitalize and replace hyphens)
    const label = part
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label: label,
      path: currentPath,
    });
  });

  return breadcrumbs;
};

// ========================================
// NAVIGATION STATE HELPERS
// ========================================

/**
 * Check if navigation should preserve scroll position
 * (e.g., when going back to a list page)
 */
export const shouldPreserveScroll = (
  fromPath: string,
  toPath: string
): boolean => {
  // Preserve scroll when navigating back from detail to list
  if (isProductDetailRoute(fromPath) && toPath.includes("/products")) {
    return true;
  }

  if (isOrderDetailRoute(fromPath) && toPath.includes("/orders")) {
    return true;
  }

  return false;
};

/**
 * Get the previous route type
 * Useful for "Back" button behavior
 */
export const getPreviousRouteType = (
  currentPath: string
): "buyer" | "seller" | "other" => {
  if (isBuyerRoute(currentPath)) return "buyer";
  if (isSellerRoute(currentPath)) return "seller";
  return "other";
};

// ========================================
// URL VALIDATION
// ========================================

/**
 * Check if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if a URL is external (not part of the app)
 */
export const isExternalUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
};

// ========================================
// ROUTE MATCHING
// ========================================

/**
 * Check if current path matches a route pattern
 * @param pathname - Current pathname
 * @param pattern - Route pattern (e.g., '/product/:id')
 * @returns Whether the path matches the pattern
 */
export const matchesRoute = (pathname: string, pattern: string): boolean => {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  return patternParts.every((part, i) => {
    return part.startsWith(":") || part === pathParts[i];
  });
};

/**
 * Get active route key for navigation highlighting
 * @param pathname - Current pathname
 * @returns Active route key or null
 */
export const getActiveRouteKey = (
  pathname: string
): string | null => {
  if (pathname === BUYER_ROUTES.HOME) return "home";
  if (pathname.includes("/products")) return "products";
  if (pathname.includes("/cart")) return "cart";
  if (pathname.includes("/orders")) return "orders";
  if (pathname.includes("/wishlist")) return "wishlist";

  // Seller routes
  if (pathname === SELLER_ROUTES.DASHBOARD) return "seller-dashboard";
  if (pathname.includes("/seller/products")) return "seller-products";
  if (pathname.includes("/seller/orders")) return "seller-orders";
  if (pathname.includes("/seller/analytics")) return "seller-analytics";

  return null;
};
