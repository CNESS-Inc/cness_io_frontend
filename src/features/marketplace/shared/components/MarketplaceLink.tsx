/**
 * Marketplace Link Component
 *
 * Type-safe link component for marketplace routes.
 * Provides better type safety and cleaner syntax than regular <Link>.
 *
 * Usage:
 *
 * Static route:
 * <MarketplaceLink to={BUYER_ROUTES.HOME}>Home</MarketplaceLink>
 *
 * Dynamic route:
 * <MarketplaceLink to={BUYER_ROUTES.PRODUCT_DETAIL} params="123">
 *   View Product
 * </MarketplaceLink>
 *
 * With className:
 * <MarketplaceLink to={BUYER_ROUTES.CART} className="btn-primary">
 *   Go to Cart
 * </MarketplaceLink>
 */

import React from "react";
import { Link, LinkProps } from "react-router-dom";

// ========================================
// TYPES
// ========================================

/**
 * Props for MarketplaceLink component
 * Extends React Router's LinkProps but makes 'to' more flexible
 */
interface MarketplaceLinkProps extends Omit<LinkProps, "to"> {
  /**
   * The route to navigate to.
   * Can be a string (for static routes) or a function (for dynamic routes)
   */
  to: string | ((params?: any) => string);

  /**
   * Parameters to pass to the route function (for dynamic routes)
   * Required when 'to' is a function
   */
  params?: any;

  /**
   * Children to render inside the link
   */
  children: React.ReactNode;

  /**
   * Optional className for styling
   */
  className?: string;

  /**
   * Whether to replace the current entry in the history stack
   */
  replace?: boolean;

  /**
   * State to pass to the location
   */
  state?: any;

  /**
   * Whether to open in a new tab
   */
  newTab?: boolean;
}

// ========================================
// COMPONENT
// ========================================

/**
 * Type-safe link component for marketplace routes
 */
export const MarketplaceLink: React.FC<MarketplaceLinkProps> = ({
  to,
  params,
  children,
  className,
  replace,
  state,
  newTab = false,
  ...restProps
}) => {
  // Generate the href based on whether 'to' is a string or function
  const href = typeof to === "function" ? to(params) : to;

  // Props for new tab opening
  const newTabProps = newTab
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Link
      to={href}
      className={className}
      replace={replace}
      state={state}
      {...newTabProps}
      {...restProps}
    >
      {children}
    </Link>
  );
};

// ========================================
// ADDITIONAL LINK VARIANTS
// ========================================

/**
 * Button-styled link for marketplace routes
 * Useful for CTAs and action buttons
 */
interface MarketplaceButtonLinkProps extends MarketplaceLinkProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const MarketplaceButtonLink: React.FC<MarketplaceButtonLinkProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  // You can customize these classes based on your design system
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClassName = `inline-flex items-center justify-center rounded-md font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return <MarketplaceLink {...props} className={combinedClassName} />;
};

/**
 * External link component with security attributes
 * Use for links that go outside the marketplace
 */
interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

// ========================================
// DEFAULT EXPORT
// ========================================
export default MarketplaceLink;
