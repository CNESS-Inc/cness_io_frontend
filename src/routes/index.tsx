import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import EmailVerify from "../components/ui/EmailVerify";
import PaymentVerify from "../components/ui/PaymentVerify";
import ResetPassword from "../components/ui/ResetPassword";
import Why from "../pages/Why";
// import What from "../pages/What";
import GenerateBadgeCode from "../pages/GenerateBadgeCode";
import AssessmentQuestion from "../pages/AssessmentQuestion";
import Setting from "../pages/Setting";
import What from "../pages/What";
import Social from "../pages/Social";
import SinglePost from "../components/Social/SinglePost";
import ReelsCard from "../components/Social/Reels/ReelsCard";
import About from "../pages/About";
import SocialLayout from "../layout/SocialLayout";
import UploadProof from "../pages/UploadProof";
import LearningLab from "../pages/LearningLab";
import UpgradeBadge from "../pages/UpgradeBadge";
import DirectoryProfile from "../pages/DirectoryProfile";
import Notification from "../pages/Notification";
import Support from "../pages/Support";
import MarketPlace from "../pages/MarketPlace";
import SearchListing from "../pages/SearchListing";
import DigitalProducts from "../pages/DigitalProducts";
import Feed from "../pages/Feed";
import SearchExplore from "../pages/SearchExplore";
import BecomeMentor from "../pages/BecomeMentor";
//import DashboardDirectoryPage from "../pages/DashboardDirectoryPage";
import EditPublicListing from "../pages/EditPublicListing";
import VisibilitySettings from "../pages/VisibilitySettings";
import RatingReviews from "../pages/RatingReviews";
import SellProducts from "../pages/SellProducts";
import Tracking from "../pages/Tracking";
import CreatorGuideline from "../pages/CreatorGuideline";
import Profile from "../pages/Profile";
import MyConnection from "../pages/MyConnection";
import ComingSoon from "../pages/ComingSoon";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";
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

const Login = lazy(() => import("../pages/Login"));

const Signingup = lazy(() => import("../pages/Signingup"));
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
  path: "/why",
  element: <Why />,
},
{
  path: "/what",
  element: <What />,
},
{
  path: "/about",
  element: <About />,
},

      {
        path: "dashboard",
        element: <DashboardLayout />, // ✅ now it's wrapped!
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
          {
            path: "generate-code",
            element: <GenerateBadgeCode />,
          },
          {
            path: "assesment",
            element: <AssessmentQuestion />,
          },
          {
            path: "setting",
            element: <Setting />,
          },
          {
            path: "upload-proof",
            element: <UploadProof />,
          },
          {
            path: "learning-lab",
            element: <LearningLab />,
          },
          {
            path: "upgrade-badge",
            element: <UpgradeBadge />,
          },
          {
            path: "directory-profile",
            element: <DirectoryProfile />,
          },
          {
            path: "notification",
            element: <Notification />,
          },
          {
            path: "support",
            element: <Support />,
          },
          {
            path: "market_place",
            element: <MarketPlace />,
          },
          {
            path: "search_listing",
            element: <SearchListing />,
          },
           {
            path: "digital_products",
            element: <DigitalProducts />,
          },

            {
            path: "Feed",
            element: <Feed />,
          },

           {
            path: "SearchExplore",
            element: <SearchExplore />,
          },
             {
            path: "Become_mentor",
            element: <BecomeMentor />,
          },
         {
            path: "GenerateBadgeCode",
            element: <GenerateBadgeCode />,
          },
               {
            path: "UploadProof",
            element: <UploadProof />,
          },
     {
            path: "EditPublicListing",
            element: <EditPublicListing />,
          },

             {
            path: "VisibilitySettings",
            element: <VisibilitySettings />,
          },

    {
            path: "RatingReviews",
            element: <RatingReviews />,
          },

            {
            path: "SellProducts",
            element: <SellProducts />,
          },
 {
            path: "Tracking",
            element: <Tracking />,
          },

           {
            path: "CreatorGuideline",
            element: <CreatorGuideline />,
          },
            {
            path: "Profile",
            element: <Profile />,
          },
 {
            path: "MyConnection",
            element: <MyConnection />,
          },
           {
            path: "ComingSoon",
            element: <ComingSoon />,
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
        path: "technology-ai",
        children: [
          {
            index: true,
            element: <TechnologyAndAIPage />,
          },
          {
            path: ":subcategory",
            element: <TechnologyAndAIPage />,
          },

          
        ],
      },
    ],
  },
  {
    path: "social",
    element: <SocialLayout />,
    children: [
      {
        index: true,
        element: <Social />,
      },

      {
        path: "singlepost/:id?",
        element: <SinglePost />,
      },
      {
        path: "reel/:id?",
        element: <ReelsCard />,
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
  {
    path: "/log-in",
    element: <Login />,
  },

  {
    path: "/sign-up",
    element: <Signingup />,
  },
]);
