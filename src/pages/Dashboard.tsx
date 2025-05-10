import { useEffect, useState } from "react";
import DashboardSection from "../components/sections/DashboardSection";
import DashboardHeader from "../layout/Dashboard/DashboardHeader";
import DashboardNavbar from "../layout/Dashboard/DashboardNavbar";
import { DashboardDetails } from "../Common/ServerAPI";

interface UserData {
  id: number;
  name: string;
  email: string;
}

// Define the API response type
interface ApiResponse<T> {
  data?: {
    data?: T;
  };
}

const Dashboard = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const fetchDashboard = async () => {
    try {
      const response: ApiResponse<UserData> = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f9f9f9] w-full max-w-[1440px] flex flex-col">
        {/* Mobile Header - Always visible on mobile */}
        {!isMobileNavOpen && (
          <div className="md:hidden">
            <DashboardHeader
              toggleMobileNav={toggleMobileNav}
              userData={user}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Navbar - Hidden on mobile unless toggled */}
          <DashboardNavbar
            isMobileNavOpen={isMobileNavOpen}
            toggleMobileNav={toggleMobileNav}
            userData={user}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Header - Only visible on desktop */}
            <div className="hidden md:block">
              <DashboardHeader userData={user} />
            </div>

            {/* Page Content */}
            <DashboardSection userData={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
