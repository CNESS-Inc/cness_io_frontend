// dashboardlayout.tsx

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardNavbar from "./DashboardNavbar";
import hambur from "../../assets/hambur.png"

import { Outlet } from "react-router-dom";

const DashboardLayout = () => {

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
     setIsMobileNavOpen(prev => !prev);
  };

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

<div className="flex flex-col md:flex-row ">
  {/* Sidebar: always render */}
  <DashboardNavbar
    isMobileNavOpen={isMobileNavOpen}
    toggleMobileNav={toggleMobileNav}
  />

  {/* Main content */}
<div className={`flex-1 flex flex-col transition-all duration-300 
  ${isMobileNavOpen ? 'md:ml-[260px]' : 'md:ml-0'}`}>
    {/* Header: show on desktop */}
<div className="hidden md:block pl-3">
      <DashboardHeader toggleMobileNav={toggleMobileNav} />
    </div>
  <main className="flex-1 min-h-screen px-4 md:px-6 py-6 overflow-y-auto">
      <Outlet />
    </main>
          </div>
        </div>
      </div>


{isMobileNavOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    {/* Backdrop behind sidebar */}
    <div
    className="fixed inset-0 bg-transparent z-40 md:hidden"
      onClick={toggleMobileNav}
    />

    {/* Sidebar container with slide-in animation */}
    <div className="absolute left-0 top-0 w-64 h-full z-50">
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
