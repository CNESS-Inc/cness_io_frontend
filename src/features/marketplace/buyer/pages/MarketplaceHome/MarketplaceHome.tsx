/**
 * Marketplace Home Page
 *
 * Main landing page for the marketplace with navigation bar.
 */

import React from "react";
import MarketplaceNavBar from "../../components/MarketplaceNavBar";
import "./MarketplaceHome.css";

export default function MarketplaceHome() {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
  };

  return (
    <div className="marketplace-home">
      <MarketplaceNavBar onSearch={handleSearch} />

      {/* Main Content */}
      <div className="marketplace-content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Discover Amazing Digital Products
              </h1>
              <p className="hero-subtitle">
                Explore thousands of videos, courses, music, podcasts, e-books,
                and digital art from talented creators worldwide.
              </p>
              <div className="hero-actions">
                <button className="btn-primary">Explore Products</button>
                <button className="btn-secondary">Learn More</button>
              </div>
            </div>
            <div className="hero-image">
              {/* Placeholder for hero image */}
              <div className="hero-placeholder">
                <svg
                  width="400"
                  height="300"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="400"
                    height="300"
                    fill="url(#gradient)"
                    rx="12"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0"
                      y1="0"
                      x2="400"
                      y2="300"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="150" r="60" fill="#3b82f6" opacity="0.2" />
                  <circle cx="150" cy="100" r="40" fill="#8b5cf6" opacity="0.2" />
                  <circle cx="250" cy="180" r="50" fill="#6366f1" opacity="0.2" />
                </svg>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="categories-section">
            <h2 className="section-title">Browse by Category</h2>
            <div className="categories-grid">
              {[
                { name: "Videos", icon: "🎥", count: "1,234", color: "#ef4444" },
                { name: "Music", icon: "🎵", count: "856", color: "#f59e0b" },
                { name: "Podcasts", icon: "🎙️", count: "432", color: "#8b5cf6" },
                { name: "E-books", icon: "📚", count: "2,145", color: "#3b82f6" },
                { name: "Courses", icon: "🎓", count: "678", color: "#10b981" },
                { name: "Arts", icon: "🎨", count: "921", color: "#ec4899" },
              ].map((category) => (
                <div
                  key={category.name}
                  className="category-card"
                  style={{ "--category-color": category.color } as React.CSSProperties}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.count} products</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="featured-section">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="products-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="product-card-placeholder">
                  <div className="product-image-placeholder"></div>
                  <div className="product-info">
                    <h4>Product Title {item}</h4>
                    <p className="product-price">$29.99</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-number">10,000+</h3>
                <p className="stat-label">Digital Products</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">5,000+</h3>
                <p className="stat-label">Active Sellers</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">50,000+</h3>
                <p className="stat-label">Happy Customers</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">4.8/5</h3>
                <p className="stat-label">Average Rating</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
