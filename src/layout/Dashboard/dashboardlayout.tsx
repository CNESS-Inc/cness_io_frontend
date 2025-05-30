// dashboardlayout.tsx
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
}) => {

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
    const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };


  return (
 <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen relative">
      <div className="bg-[#f9f9f9] w-full max-w-[1440px] flex flex-col">
        {/* Mobile Header */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader toggleMobileNav={toggleMobileNav} />
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <DashboardNavbar isMobileNavOpen={false} toggleMobileNav={toggleMobileNav} />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:block">
              <DashboardHeader />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileNav}
          ></div>

          {/* Sidebar */}
          <div className="relative w-64 bg-white h-full shadow-lg z-50">
            <DashboardNavbar
              isMobileNavOpen={true}
              toggleMobileNav={toggleMobileNav}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardLayout;
