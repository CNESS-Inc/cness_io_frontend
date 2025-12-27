import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";
import DashboardFilterSidebar from "./DashboardFilterSidebar";
import hambur from "../../assets/hambur.png";
import DashboardFooter from "../Footer/DashboardFooter";
import { MessagingProvider } from "../../components/Messaging/MessagingContext";
import PersistentMessagingWidget from "../../components/Messaging/PersistentMessagingWidget";
import { CartWishlistProvider } from "../../components/MarketPlace/context/CartWishlistContext";
import MarketplaceNavBar from "../../features/marketplace/buyer/components/MarketplaceNavBar";
import MarketSellerHeader from "../../features/marketplace/seller/components/MarketSellerHeader";
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

    
     const isSellerPage  =
    location.pathname.includes("dashboard/new-marketplace/seller")

  const isMarketplacePage =
    location.pathname.includes("/dashboard/new-marketplace") && !isSellerPage;
 

 


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
    pageBackground = "bg-white"; // light blue background for seller pages
  }

  return (
    <CartWishlistProvider>
      <div
        className={`flex flex-col justify-center w-full min-h-screen relative ${pageBackground}`}
      >
        {/* Outer container */}
        <div
          className={`w-full flex flex-col relative ${pageBackground}`}
        >
          {/* Mobile Header */}
          {/* {!isMobileNavOpen && (
            <div className="md:hidden">
              <DashboardHeader
                toggleMobileNav={toggleMobileNav}
                isMobileNavOpen={isMobileNavOpen}
              />
            </div>
          )} */}

          {/* Desktop Hamburger Button */}
          {!isMobileNavOpen && (
            <button
              onClick={toggleMobileNav}
              className="hidden md:block fixed top-4 left-4 z-100 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img src={hambur} alt="Menu" className="w-6 h-6" />
            </button>
          )}

          {/* Desktop Headers */}
<div className={`md:block transition-all duration-300 ${isMobileNavOpen ? "md:ml-60" : "md:ml-0"}`}>

  {/* ================= SELLER PAGES ================= */}
  {isSellerPage && (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#EEF3FF] border-b border-gray-100">
        <DashboardHeader
          toggleMobileNav={toggleMobileNav}
          isMobileNavOpen={isMobileNavOpen}
        />
      </div>

      <div className={`fixed top-[72px] z-40 inset-x-0 transition-all duration-300
        ${isMobileNavOpen ? "md:ml-64" : "md:ml-0"}`}>
        <MarketSellerHeader />
      </div>
    </>
  )}

  {/* ================= MARKETPLACE BUYER PAGES ================= */}
  {isMarketplacePage && !isSellerPage && (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <DashboardHeader
          toggleMobileNav={toggleMobileNav}
          isMobileNavOpen={isMobileNavOpen}
        />
      </div>

      <div className={`fixed top-[72px] z-40 bg-white inset-x-0 transition-all duration-300
        ${isMobileNavOpen ? "md:ml-64" : "md:ml-0"}`}>
        <MarketplaceNavBar />
      </div>
    </>
  )}

  {/* ================= OTHER DASHBOARD PAGES ================= */}
  {!isMarketplacePage && !isSellerPage && (
    <DashboardHeader
      toggleMobileNav={toggleMobileNav}
      isMobileNavOpen={isMobileNavOpen}
    />
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
            className={`flex-1 flex flex-col transition-all duration-300 ${isMobileNavOpen ? "md:ml-64" : "md:ml-0"
              }`}
          >
            <main
              className={`
            flex-1 min-h-screen overflow-y-auto transition-all duration-300
            ${hasNoPadding || isCreateShopPage ? "px-2 py-2 pb-14" : "px-4 py-3 pb-14"}
            ${isMarketplacePage ? "pt-0" : "pt-0"}
            sm:px-4 sm:py-3
    md:px-6 md:py-4
    lg:px-2 lg:py-2
          `}
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
                <div className="flex-1 overflow-x-hidden">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Footer & Messaging */}
        <div
          className={`transition-all duration-300 ${isMobileNavOpen ? "md:ml-64" : "md:ml-0"
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
    </CartWishlistProvider>
  );
};

export default DashboardLayout;