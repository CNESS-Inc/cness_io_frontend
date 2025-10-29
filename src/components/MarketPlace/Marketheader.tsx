import React, { useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Mhome from "../../assets/Mhome.svg";
import Mhome1 from "../../assets/Mhome1.svg";
import sellbag from "../../assets/ep_sell.svg";

interface MarketHeaderProps {
  toggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/dashboard/market-place", icon: Mhome },
    { name: "Categories", path: "/dashboard/categories" },
    { name: "Shops", path: "/dashboard/shops" },
    { name: "My Collections", path: "/dashboard/collections" },
    { name: "Library", path: "/dashboard/library" },
    { name: "Order History", path: "/dashboard/order-history" },
    { name: "FAQs", path: "/dashboard/faqs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 z-40 relative w-full ">
      <div className="flex items-center justify-between w-full px-4 md:px-8 py-4">
        {/* LEFT: Navigation */}
        <nav
          className="hidden md:flex items-center text-[#665B5B] font-[400] space-x-6 md:space-x-8 relative"
          style={{
            fontFamily: "Poppins",
            fontSize: "14px",
            letterSpacing: "-0.019em",
            lineHeight: "100%",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative flex items-center gap-1 pb-[4px] transition-all duration-200 
                ${
                  isActive(link.path)
                    ? "text-[#9747FF]"
                    : "text-[#665B5B] hover:text-[#9747FF]"
                }`}
            >
              {/* ✅ Only show icon for Home */}
              {link.name === "Home" ? (
                <img
                  src={isActive(link.path) ? Mhome1 : Mhome}
                  alt="Home"
                  className="w-[22px] h-[22px]"
                />
              ) : (
                link.name
              )}

              {/* Purple underline perfectly on border */}
              {isActive(link.path) && (
                <span className="absolute bottom-[-13px] left-0 w-full h-[4px] bg-[#9747FF] rounded-full transition-all duration-300 ease-in-out"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Heart & Cart */}
        <div className="flex items-center space-x-4 md:space-x-5">
         <button
  onClick={() => navigate(`/dashboard/sellerdashboard`)}
  className="flex items-center gap-2 px-4 py-2 text-[#9747FF] font-[Poppins] text-[14px] font-normal leading-[150%] tracking-[-0.019em] bg-white rounded-md hover:opacity-80 transition"
>
  <img src={sellbag} alt="Sell" className="w-5 h-5" />
  <span>Become a Seller</span>
</button>
          <button
            onClick={() => navigate(`/dashboard/wishlist`)}
            className="p-2 rounded-lg hover:bg-gray-100 transition shadow-sm"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-[#8A8A8A]" />
          </button>

          <button
            onClick={() => navigate(`/dashboard/cart`)}
            className="p-2 rounded-lg hover:bg-gray-100 transition shadow-sm"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-[#8A8A8A]" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#665B5B]" />
            ) : (
              <Menu className="w-6 h-6 text-[#665B5B]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 w-full">
          <nav
            className="flex flex-col px-6 py-4 space-y-4 text-[#665B5B]"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              letterSpacing: "-0.019em",
              lineHeight: "150%",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`relative flex items-center gap-2 transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-[#9747FF] font-medium"
                    : "hover:text-[#9747FF]"
                }`}
              >
                {/* Icon only for Home in mobile menu too */}
                {link.name === "Home" && (
                  <img
                    src={isActive(link.path) ? Mhome1 : Mhome}
                    alt="Home"
                    className="w-[20px] h-[20px]"
                  />
                )}
                {link.name !== "Home" && link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9747FF]"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MarketHeader;
