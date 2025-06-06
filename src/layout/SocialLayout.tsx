// src/layout/SocialLayout.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const SocialLayout = () => {
  const location = useLocation();
  const personOrganization = localStorage.getItem("person_organization");

  useEffect(() => {
    // Optional: You can add additional checks or logging here
  }, [location]);

  if (personOrganization !== "1") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default SocialLayout;