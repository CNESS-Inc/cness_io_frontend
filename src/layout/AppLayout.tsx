import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "./Header";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Footer from "./Footer/Footer";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
};

export default AppLayout;
