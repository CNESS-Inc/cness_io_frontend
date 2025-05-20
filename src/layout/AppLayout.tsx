import { Outlet, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AppLayout = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwt'); // or your specific token key
      console.log("🚀 ~ checkAuth ~ token:", token)
      const completed_step = localStorage.getItem('completed_step'); // or your specific token key
      console.log("🚀 ~ checkAuth ~ completed_step:", completed_step)
      if (!token  || completed_step === 'false') {
        navigate('/'); 
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AppLayout;