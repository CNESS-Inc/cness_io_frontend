
import { useEffect, useState } from "react";
import DashboardSection from "../components/sections/DashboardSection";
import { DashboardDetails } from "../Common/ServerAPI";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   isMobileNavOpen?: boolean;  // Make it optional if needed
//   toggleMobileNav?: () => void;  // Make it optional if needed
// }

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
      <DashboardSection user={user}/>
    </DashboardLayout>

  );
};

export default Dashboard;
