import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import EmailVerify from "../components/ui/EmailVerify";
import PaymentVerify from "../components/ui/PaymentVerify";
import ResetPassword from "../components/ui/ResetPassword";

// Lazy-loaded pages
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
const TechnologyAndAIPage = lazy(() => import("../pages/TechnologyandAI"));

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
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "score-result",
            element: <ScoreResult />,
          },
          {
            path: "user-profile",
            element: <UserProfilePage />,
          },
          {
            path: "company-profile",
            element: <OrganaizationProfilepage />,
          },
        ],
      },
    ],
  },
  {
    path: "directory",
    children: [
      {
        index: true,
        element: <DirectoryPage />,
      },

      {
        path: "company-profile/:id",
        element: <PublicCompanyProfile />,
      },

      {
        path: "user-profile/:id",
        element: <UserProfileView />,
      },
      {
        path: "technology_ai",
        element: <TechnologyAndAIPage />,
      },
    ],
  },
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
