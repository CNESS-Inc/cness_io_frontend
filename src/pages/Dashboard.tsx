import { useState } from "react";
import DashboardSection from "../components/sections/DashboardSection";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";

const Dashboard = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

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
