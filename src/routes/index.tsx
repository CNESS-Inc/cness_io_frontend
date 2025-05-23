import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import EmailVerify from "../components/ui/EmailVerify";
import PaymentVerify from "../components/ui/PaymentVerify";
import ResetPassword from "../components/ui/ResetPassword";
const HomePage = lazy(() => import("../pages/Home"));
const DirectoryPage = lazy(() => import("../pages/DirectoryPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ScoreResult = lazy(
  () => import("../components/sections/DashboardSection/ScoreResult")
);
const UserProfilePage = lazy(
  () => import("../components/sections/DashboardSection/UserProfilePage")
);
const OrganaizationProfilepage = lazy(
  () => import("../components/sections/DashboardSection/OrganizationProfile")
);
const PublicCompanyProfile = lazy(
  () => import("../pages/PublicCompanyProfile")
);
const UserProfileView = lazy(() => import("../pages/UserProfileView"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "score-result",
        element: <ScoreResult />,
      },
      {
        path: "dashboard/user-profile",
        element: <UserProfilePage />,
      },

      {
        path: "dashboard/company-profile",
        element: <OrganaizationProfilepage />,
      },

      {
        path: "company-profile",
        element: <PublicCompanyProfile />,
      },

      {
        path: "user-profile",
        element: <UserProfileView />,
      },
    ],
  },
  { path: "directory", element: <DirectoryPage /> },

  {
    path: "/email-verify",
    element: <EmailVerify />,
  },
  {
    path: "/payment-confirmation",
    element: <PaymentVerify />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);
