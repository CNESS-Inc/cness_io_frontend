// dashboardlayout.tsx
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardNavbar from './DashboardNavbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  return (
    <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f9f9f9] w-full max-w-[1440px] flex flex-col">
        {/* Mobile Header */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader toggleMobileNav={toggleMobileNav} />
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          <DashboardNavbar isMobileNavOpen={isMobileNavOpen} toggleMobileNav={toggleMobileNav} />

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
    </div>
  );
};

export default DashboardLayout;
