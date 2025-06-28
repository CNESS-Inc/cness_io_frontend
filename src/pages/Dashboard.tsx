
import { useEffect, useRef, useState } from "react";
import DashboardSection from "../components/sections/DashboardSection";
import { DashboardDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

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
  const [_user, setUser] = useState<UserData | null>(null);
    const { showToast } = useToast();
  

  const hasFetched = useRef(false);

  const fetchDashboard = async () => {
    try {
      const response: ApiResponse<UserData> = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("name",response.data.data?.name);
        // localStorage.setItem("profile_picture",response.data.data?.profile_picture);
      }
    } catch (error:any) {
      console.error("Error fetching dashboard data:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDashboard();
      hasFetched.current = true;
    }
  }, []);

  return (
  
      <DashboardSection />
  );
};

export default Dashboard;
