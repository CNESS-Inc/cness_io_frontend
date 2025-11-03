import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";
import MarketHeader from "../../components/MarketPlace/Buyerheader";
import DashboardFilterSidebar from "./DashboardFilterSidebar";
import hambur from "../../assets/hambur.png";
import DashboardFooter from "../Footer/DashboardFooter";
import { MessagingProvider } from "../../components/Messaging/MessagingContext";
import PersistentMessagingWidget from "../../components/Messaging/PersistentMessagingWidget";
import SellerHeader from "../../components/MarketPlace/SellerHeader";

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [sort, setSort] = useState<"az" | "za">("az");

  const noPaddingRoutes = [
    "/dashboard/Become_partner",
    "/dashboard/become-mentor",
    "/dashboard",
  ];
  const hasNoPadding = noPaddingRoutes.includes(location.pathname);

  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsMobileNavOpen(true);
    }
  }, []);



  const isDashboardTechPage =
    location.pathname === "/DashboardDirectory/dashboardtechnology";

  const isMarketplacePage =
    location.pathname.includes("/dashboard/product-detail") ||
    location.pathname.includes("/dashboard/market-place") ||
    location.pathname.includes("/dashboard/shop-detail") ||
    location.pathname.includes("/dashboard/product-review") ||
    location.pathname.includes("/dashboard/cart") ||
    location.pathname.includes("/dashboard/collections") ||
    location.pathname.includes("/dashboard/library") ||
    location.pathname.includes("/dashboard/order-history") ||
    location.pathname.includes("/dashboard/faqs") ||
    location.pathname.includes("/dashboard/categories") ||
    location.pathname.includes("/dashboard/shops");


  const isSellerPage =
    location.pathname.includes("/dashboard/seller-dashboard") ||
    location.pathname.includes("/dashboard/products") ||
    location.pathname.includes("/dashboard/orderlist") ||
    location.pathname.includes("/dashboard/seller-sales");

  const isCreateShopPage =
    location.pathname.includes("/dashboard/createshop") ||
    location.pathname.includes("/dashboard/products/add-video") ||
    location.pathname.includes("/dashboard/products/add-ebook") ||
    location.pathname.includes("/dashboard/products/add-podcast") ||
    location.pathname.includes("/dashboard/products/add-music") ||
    location.pathname.includes("/dashboard/products/add-course") ||
    location.pathname.includes("/dashboard/products/add-arts");


  let pageBackground = "bg-[#f9f9f9]";

  if (isMarketplacePage) {
    pageBackground = "bg-white";
  } else if (isCreateShopPage || isSellerPage) {
    pageBackground = "bg-[#EEF3FF]"; // light blue background for seller pages
  }


  return (
    <div
      className={`flex flex-col justify-center w-full min-h-screen relative ${pageBackground}`}

    >
      {/* Outer container */}
      <div
        className={`w-full flex flex-col relative ${pageBackground}`}

      >
        {/* Mobile Header */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader
              toggleMobileNav={toggleMobileNav}
              isMobileNavOpen={isMobileNavOpen}
            />
          </div>
        )}

        {/* Desktop Hamburger Button */}
        {!isMobileNavOpen && (
          <button
            onClick={toggleMobileNav}
            className="hidden md:block fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md cursor-pointer"
          >
            <img src={hambur} alt="Menu" className="w-6 h-6" />
          </button>
        )}

        {/* Desktop Headers */}
        <div
          className={`hidden md:block transition-all duration-300 ${isMobileNavOpen ? "md:ml-[240px]" : "md:ml-0"
            }`}
        >
          {isMarketplacePage ? (
            <>
              {/* Fixed Dashboard Header */}
              <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <DashboardHeader
                  toggleMobileNav={toggleMobileNav}
                  isMobileNavOpen={isMobileNavOpen}
                />
              </div>

              {/* Market Header below */}
              <div
                className={`fixed top-[80px] right-0 z-40 bg-white transition-all duration-300 ${isMobileNavOpen ? "left-[256px]" : "left-0"
                  }`}
              >
                <MarketHeader
                  toggleMobileNav={toggleMobileNav}
                  isMobileNavOpen={isMobileNavOpen}
                />
              </div>
            </>
          ) : isSellerPage ? (
            <>
              {/* Fixed Dashboard Header */}
              <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <DashboardHeader
                  toggleMobileNav={toggleMobileNav}
                  isMobileNavOpen={isMobileNavOpen}
                />
              </div>

              {/* Seller Header below */}
              <div
                className={`fixed top-[80px] right-0 z-40 bg-white transition-all duration-300 ${isMobileNavOpen ? "left-[256px]" : "left-0"
                  }`}
              >
                <SellerHeader
                  toggleMobileNav={toggleMobileNav}
                />
              </div>
            </>
          ) : (
            <div className="relative">
              <DashboardHeader
                toggleMobileNav={toggleMobileNav}
                isMobileNavOpen={isMobileNavOpen}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <DashboardNavbar
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          currentPath={location.pathname}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          sort={sort}
          setSort={setSort}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
            }`}
        >
          <main
            className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${hasNoPadding || isCreateShopPage ? "px-0 py-3 pb-14" : "px-4 py-3 pb-14"} ${isMarketplacePage
                ? "pt-[160px]" // for MarketHeader
                : isSellerPage
                  ? "pt-[10px]" // for SellerHeader
                  : isCreateShopPage
                    ? "pt-0" // ✅ attach directly under topbar
                    : "" // default DashboardHeader height
              }`}
          >
            {/* ↑ adjust this padding to match the total header height (72 + 60) */}
            <div className="flex min-h-screen mb-auto">
              {isDashboardTechPage && (
                <div className="w-[250px] shrink-0 border-r border-gray-200 mr-4">
                  <DashboardFilterSidebar
                    selectedDomain={selectedDomain}
                    setSelectedDomain={setSelectedDomain}
                    sort={sort}
                    setSort={setSort}
                  />
                </div>
              )}
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer & Messaging */}
      <div
        className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
          }`}
      >
        <MessagingProvider>
          <PersistentMessagingWidget />
        </MessagingProvider>
        <DashboardFooter />
      </div>

      {/* Mobile Sidebar */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-transparent z-40 md:hidden"
            onClick={toggleMobileNav}
          />
          <div className="absolute left-0 top-0 w-64 h-full z-50">
            <DashboardNavbar
              isMobileNavOpen={true}
              toggleMobileNav={toggleMobileNav}
              currentPath={location.pathname}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
