/**
 * Marketplace Navigation Bar
 *
 * Top navigation bar for the marketplace with search, categories, and user actions.
 * Based on the provided design mockup.
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BUYER_ROUTES } from "../../shared/constants/routes";
import { useMarketplaceNavigation } from "../../shared/hooks/useMarketplaceNavigation";
import "./MarketplaceNavBar.css";

interface MarketplaceNavBarProps {
  onSearch?: (query: string) => void;
}

export const MarketplaceNavBar: React.FC<MarketplaceNavBarProps> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { goToHome, goToProducts, goToCart, goToOrders, goToWishlist } =
    useMarketplaceNavigation();

  // Categories list
  const categories = [
    { id: "videos", name: "Videos", icon: "🎥" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "podcasts", name: "Podcasts", icon: "🎙️" },
    { id: "ebooks", name: "E-books", icon: "📚" },
    { id: "courses", name: "Courses", icon: "🎓" },
    { id: "arts", name: "Arts", icon: "🎨" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`${BUYER_ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(BUYER_ROUTES.CATEGORY(categoryId));
    setShowCategories(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="marketplace-navbar">
      {/* Top Bar */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo" onClick={goToHome}>
            <h2>Marketplace</h2>
          </div>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search for products, courses, arts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Wishlist */}
            <button
              className={`nav-action-btn ${isActive(BUYER_ROUTES.WISHLIST) ? "active" : ""}`}
              onClick={goToWishlist}
              title="Wishlist"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="nav-label">Wishlist</span>
            </button>

            {/* Cart */}
            <button
              className={`nav-action-btn ${isActive(BUYER_ROUTES.CART) ? "active" : ""}`}
              onClick={goToCart}
              title="Cart"
            >
              <div className="cart-icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 2L1 6v6a10 10 0 0 0 8 8 10 10 0 0 0 8-8V6l-8-4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="cart-badge">3</span>
              </div>
              <span className="nav-label">Cart</span>
            </button>

            {/* Orders */}
            <button
              className={`nav-action-btn ${isActive(BUYER_ROUTES.ORDERS) ? "active" : ""}`}
              onClick={goToOrders}
              title="My Orders"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="3.27 6.96 12 12.01 20.73 6.96"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="22.08"
                  x2="12"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="nav-label">Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="navbar-bottom">
        <div className="navbar-container">
          <nav className="navbar-menu">
            {/* Categories Dropdown */}
            <div className="nav-dropdown">
              <button
                className="nav-dropdown-trigger"
                onClick={() => setShowCategories(!showCategories)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>All Categories</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`dropdown-arrow ${showCategories ? "open" : ""}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {showCategories && (
                <div className="nav-dropdown-menu">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <button
              className={`nav-link ${isActive(BUYER_ROUTES.HOME) ? "active" : ""}`}
              onClick={goToHome}
            >
              Home
            </button>

            <button
              className={`nav-link ${isActive(BUYER_ROUTES.PRODUCTS) ? "active" : ""}`}
              onClick={goToProducts}
            >
              All Products
            </button>

            <button className="nav-link">Trending</button>

            <button className="nav-link">New Arrivals</button>

            <button className="nav-link">Best Sellers</button>
          </nav>

          {/* Become Seller Button */}
          <button className="become-seller-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 1v18M1 10h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Become a Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceNavBar;
