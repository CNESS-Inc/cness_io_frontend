import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "./Header";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      <footer className="bg-gray-100 p-4 text-center">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default AppLayout;
