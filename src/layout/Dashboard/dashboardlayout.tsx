import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";
import DashboardFilterSidebar from "./DashboardFilterSidebar"; // ✅ Adjust path as needed
import hambur from "../../assets/hambur.png";
import Footer from "../Footer/Footer";

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [sort, setSort] = useState<"az" | "za">("az");

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

  return (
    <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen relative">
      <div className="bg-[#f9f9f9] w-full flex flex-col">
        {/* Mobile Header */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader toggleMobileNav={toggleMobileNav} />
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
        <div className="hidden md:block w-full">
          <DashboardHeader toggleMobileNav={toggleMobileNav} />
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
              isMobileNavOpen ? "md:ml-[260px]" : "md:ml-0"
            }`}
          >
            {/* Main layout with optional FilterSidebar */}
            <main className="flex-1 min-h-screen px-4 md:px-4 py-4 overflow-y-auto">
              <div className="flex">
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
              <div className="hidden md:block w-full">
                <Footer />
              </div>
            </main>
          </div>
          
          
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
