import { useState } from 'react';
import DashboardSection from "../components/sections/DashboardSection";
import DashboardHeader from "../layout/Dashboard/DashboardHeader";
import DashboardNavbar from "../layout/Dashboard/DashboardNavbar";

const Dashboard = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f9f9f9] w-full max-w-[1440px] flex flex-col">
        {/* Mobile Header - Always visible on mobile */}
        {!isMobileNavOpen && 
        <div className="md:hidden">
          <DashboardHeader toggleMobileNav={toggleMobileNav} />
        </div>
        }
        
        <div className="flex flex-col md:flex-row">
          {/* Navbar - Hidden on mobile unless toggled */}
          <DashboardNavbar 
            isMobileNavOpen={isMobileNavOpen} 
            toggleMobileNav={toggleMobileNav} 
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col ">
            {/* Desktop Header - Only visible on desktop */}
            <div className="hidden md:block">
              <DashboardHeader />
            </div>
            
            {/* Page Content */}
            <DashboardSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;