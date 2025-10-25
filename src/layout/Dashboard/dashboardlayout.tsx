import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";
import DashboardFilterSidebar from "./DashboardFilterSidebar"; // ✅ Adjust path as needed
import hambur from "../../assets/hambur.png";
import DashboardFooter from "../Footer/DashboardFooter";

import { MessagingProvider } from "../../components/Messaging/MessagingContext";
import PersistentMessagingWidget from "../../components/Messaging/PersistentMessagingWidget";

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [sort, setSort] = useState<"az" | "za">("az");

  const noPaddingRoutes = [
    "/dashboard/Become_partner",
    "/dashboard/become-mentor",
    "/dashboard"
  ];
  const hasNoPadding = noPaddingRoutes.includes(location.pathname);

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsMobileNavOpen(true);
    }
  }, []);

  const isDashboardTechPage =
    location.pathname === "/DashboardDirectory/dashboardtechnology";


const isMarketplacePage =
    location.pathname.includes("/dashboard/product-detail") ||
    location.pathname.includes("/dashboard/market-place")||
     location.pathname.includes("/dashboard/shop-detail")||
      location.pathname.includes("/dashboard/product-review")||
      location.pathname.includes("/dashboard/cart");



  return (
    <div 
className={`flex flex-col justify-center w-full min-h-screen relative ${
    isMarketplacePage ? "bg-white" : "bg-[#f9f9f9]"
  }`}
>      <div 
className={`w-full flex flex-col relative ${
    isMarketplacePage ? "bg-white" : "bg-[#f9f9f9]"
  }`}
>        {/* Mobile Header */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader
              toggleMobileNav={toggleMobileNav}
              isMobileNavOpen={isMobileNavOpen}
            />
          </div>
        )}

        {/* Desktop Hamburger Toggle (outside sidebar) */}
        {!isMobileNavOpen && (
          <button
            onClick={toggleMobileNav}
            className="hidden md:block fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md cursor-pointer"
          >
            <img src={hambur} alt="Menu" className="w-6 h-6" />
          </button>
        )}
        {/* Desktop Header */}
        <div
          className={`hidden md:block transition-all duration-300 ${
            isMobileNavOpen ? "md:ml-[240px]" : "md:ml-0"
          }`}
        >
          <DashboardHeader
            toggleMobileNav={toggleMobileNav}
            isMobileNavOpen={isMobileNavOpen}
          />
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

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
          }`}
        >
          {/* Main layout with optional FilterSidebar */}
          <main
            className={`flex-1 min-h-screen overflow-y-auto ${
              hasNoPadding ? "" : "px-4 py-4 pb-14"
            }`}
          >
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
              <div className="flex-1 ">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        }`}
      >
        {" "}
        <MessagingProvider>
          <PersistentMessagingWidget />
        </MessagingProvider>
        <DashboardFooter />
      </div>

      {/* Mobile Sidebar Backdrop and Slide-in */}
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
