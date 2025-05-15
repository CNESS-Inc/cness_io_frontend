
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
    <DashboardLayout
      isMobileNavOpen={isMobileNavOpen}
      toggleMobileNav={toggleMobileNav}
    >
      <DashboardSection />
    </DashboardLayout>

  );
};

export default Dashboard;
