import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CookieConsent from "../components/ui/CookieConsent";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwt");
      const completed_step = localStorage.getItem("completed_step");

      // Only redirect if user is logged in and on landing page
      if (token && completed_step !== "0" && location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
      // Allow pre-login pages to be accessed when not logged in
      // No else redirect needed - let users access all public routes

      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [navigate, location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      <CookieConsent /> {/* Add CookieConsent here */}
    </div>
  );
};

export default AppLayout;
