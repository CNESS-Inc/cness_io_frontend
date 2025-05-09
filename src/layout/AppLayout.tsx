import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AppLayout;
