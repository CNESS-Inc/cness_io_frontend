import React from "react";

interface HeaderProps {
  isMobileNavOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobileNavOpen = true }) => {
  return (
    <header
      className={`fixed z-40 bg-white transition-all duration-300 
        top-[80px] h-[70px] 
        ${isMobileNavOpen ? "md:left-[256px] md:w-[calc(100%-256px)]" : "md:left-0 md:w-full"}
      `}
    >
      <div className="h-full flex items-center justify-between px-8">
        {/* Left Navigation */}
        <div className="hidden md:flex space-x-6">
          {[
            "Top Product",
            "Categories",
            "Shop",
            "My Favourites",
            "Library",
            "Order history",
          ].map((label) => (
            <span
              key={label}
              className="text-gray-500 font-medium cursor-pointer hover:text-[#7077FE] transition-colors"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          {[
            "https://static.codia.ai/image/2025-10-15/CNAqQ9S27j.png",
            "https://static.codia.ai/image/2025-10-15/Fh8OjrxnSH.png",
            "https://static.codia.ai/image/2025-10-15/LSLZ0q2jzC.png",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Icon ${i + 1}`}
              className="w-9 h-9 md:w-10 md:h-10 cursor-pointer hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
