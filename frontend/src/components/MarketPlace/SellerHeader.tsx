import React from "react";
import { NavLink } from "react-router-dom";

interface NavButtonProps {
  label: string;
  to: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-2.5 py-3 font-poppins text-sm font-normal transition-colors ${
          isActive
            ? "text-[#9747FF] border-b-[3px] border-[#9747FF]"
            : "text-gray-600 hover:text-gray-800"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

interface SellerHeaderProps {
  toggleMobileNav: () => void;
}

const SellerHeader: React.FC<SellerHeaderProps> = ({ toggleMobileNav }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Left Section: Navigation Tabs */}
      <div className="flex items-center gap-3">
        <NavButton label="Dashboard" to="/dashboard/seller-dashboard" />
        <NavButton label="Products" to="/dashboard/products" />
        <NavButton label="Order List" to="/dashboard/orderlist" />
        <NavButton label="Sales" to="/dashboard/seller-sales" />
        <NavButton label="Help" to="/dashboard/seller-help" />
      </div>

      {/* Right Section: Optional — Add toggle or user info */}
      <div className="flex items-center gap-4">
        {/* Example: Hamburger button for smaller screens */}
        <button
          onClick={toggleMobileNav}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default SellerHeader;
