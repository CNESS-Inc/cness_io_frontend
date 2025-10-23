import React, { useState } from "react";
import { Bell, Heart, ShoppingCart, Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white  ">
      <div className="flex items-center justify-between px-5 py-4">
        {/* Left section - Nav links */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-600 font-medium text-sm ">
          <a href="#" className="hover:text-[#7077FE] transition-colors">Top Product</a>
          <a href="#" className="hover:text-[#7077FE] transition-colors">Categories</a>
          <a href="#" className="hover:text-[#7077FE] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#7077FE] transition-colors">My Favourites</a>
          <a href="#" className="hover:text-[#7077FE] transition-colors">Library</a>
          <a href="#" className="hover:text-[#7077FE] transition-colors">Order History</a>
        </nav>

        {/* Right section - Icons + Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition shadow-sm">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition shadow-sm">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition shadow-sm">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden  bg-white">
          <nav className="flex flex-col px-5 py-4 space-y-4 text-gray-600 font-medium text-sm">
            <a href="#" className="hover:text-[#7077FE] transition-colors">Top Product</a>
            <a href="#" className="hover:text-[#7077FE] transition-colors">Categories</a>
            <a href="#" className="hover:text-[#7077FE] transition-colors">Shop</a>
            <a href="#" className="hover:text-[#7077FE] transition-colors">My Favourites</a>
            <a href="#" className="hover:text-[#7077FE] transition-colors">Library</a>
            <a href="#" className="hover:text-[#7077FE] transition-colors">Order History</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
