import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Mhome from "../../assets/Mhome.svg";
import Mhome1 from "../../assets/mhome1.svg";
import sellbag from "../../assets/ep_sell.svg";
import { GetUserScoreResult } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../ui/Button";

interface MarketHeaderProps {
  toggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({ }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityCard, setEligibilityCard] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/dashboard/market-place", icon: Mhome },
    { name: "Categories", path: "/dashboard/categories" },
    { name: "Shops", path: "/dashboard/shops" },
    // { name: "My Collections", path: "/dashboard/collections" },
    { name: "Library", path: "/dashboard/library" },
    { name: "Order History", path: "/dashboard/order-history" },
    { name: "FAQs", path: "/dashboard/faqs" },
  ];

  useEffect(() => {
    fetchRatingDetails();
  }, [])


  const isActive = (path: string) => {
  // Treat Library, Continue Watching, and My Library as part of Library
  if (path === "/dashboard/library") {
    return (
      location.pathname === "/dashboard/library" ||
      location.pathname === "/dashboard/continue-watching" ||
      location.pathname === "/dashboard/my-library"
    );
  }
  return location.pathname === path;
};


  const fetchRatingDetails = async () => {
    try {
      const res = await GetUserScoreResult();
      const badge = res?.data?.data?.badge
      if (badge === null) {
        setIsEligible(false)
      } else {
        setIsEligible(true)
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleBecomeSeller = () => {
    if (isEligible) {
      navigate(`/dashboard/createshop`)
    } else {
      setEligibilityCard(true);
    }
  }

  useEffect(() => {
    document.body.style.overflow = eligibilityCard ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [eligibilityCard]);

  return (
    <>
      <header className={`bg-white border-b border-gray-200 z-40 relative w-full ${eligibilityCard ? "blur-md" : ""}`}>
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
                ${isActive(link.path)
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
              // onClick={() => navigate(`/dashboard/createshop`)}
              onClick={handleBecomeSeller}
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
                  className={`relative flex items-center gap-2 transition-colors duration-200 ${isActive(link.path)
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
      {eligibilityCard && (
        <div
          onClick={() => setEligibilityCard(false)}
          className="fixed inset-0 z-[2147483647] flex h-screen w-screen items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white py-[18px] px-3 rounded-xl border border-[#ECEEF2] overflow-hidden animate-fadeIn"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="w-full h-[300px] ps-[12px] pe-[14px] py-[18px] text-center flex flex-col justify-center">
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setEligibilityCard(false)
                }}
                className="absolute top-4 right-3 w-[20px] h-[20px] rounded-full flex items-center justify-center cursor-pointer border border-[#ECEEF2] shadow-[0px_0.56px_5.63px_0px_rgba(0,0,0,0.1)]"
              >
                <IoCloseOutline className="text-[#E1056D]" />
              </div>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] mb-4">
                <svg
                  className="w-6 sm:w-10 h-6 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="openSans text-center text-lg font-medium p-4 text-blue-500">
                Become an Aspiring Certified Member to create a shop.
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => setEligibilityCard(false)}
                  variant="gradient-primary"
                  className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketHeader;
