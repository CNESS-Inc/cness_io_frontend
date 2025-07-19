import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import EmailVerify from '../components/ui/EmailVerify';
import PaymentVerify from '../components/ui/PaymentVerify';
import ResetPassword from '../components/ui/ResetPassword';
const HomePage = lazy(() => import('../pages/Home'))
const DirectoryPage= lazy(()=> import('../pages/DirectoryPage'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
// const ScoreResult = lazy(() => import('../components/sections/DashboardSection/ScoreResult'))
// const UserProfilePage=lazy(()=>import('../components/sections/DashboardSection/UserProfilePage'))1
// const OrganaizationProfilepage=lazy(()=>import('../components/sections/DashboardSection/OrganizationProfile'))
const PublicCompanyProfile =lazy(()=>import('../pages/PublicCompanyProfile'))
const UserProfileView =lazy(()=>import('../pages/UserProfileView'))
import TermsAndConditions from '../pages/TermsAndConditions';
import Why from "../pages/Why";
import About from "../pages/About";
import PrivacyPolicy from "../pages/privacypolicy";
<<<<<<< Updated upstream
=======
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
import DashboardSocial from "../pages/DashboardSocial";
import DashboardDirectory from "../pages/DashboardDirectory";
import DashboardTechnology from "../pages/DashboardTechnology";
import BestPracticesHub from "../pages/BestPracticesHub";
import ManageBestPractices from "../pages/ManageBestPractices";
import SingleBP from "../pages/SingleBP";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/Privacypolicy";
import DashboardUserProfile from "../pages/DashboardUserProfile";

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
>>>>>>> Stashed changes

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
   { path: "why", 
    element: <Why /> },
      { path: "about",
         element: <About /> },
    

       { path: 'directory', 
        element: <DirectoryPage /> 
      },

      {
        path: 'dashboard',
        element: <Dashboard />,
<<<<<<< Updated upstream
=======
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
            element:
              import.meta.env.VITE_ENV_STAGE === "test" ? (
                <Setting />
              ) : (
                <ComingSoon />
              ),
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
            path: "market-place",
            element: <MarketPlace />,
          },
          {
            path: "search-listing",
            element:
              import.meta.env.VITE_ENV_STAGE === "test" ? (
                <SearchListing />
              ) : (
                <ComingSoon />
              ),
          },
          {
            path: "userprofile/:id",
            element: <DashboardUserProfile />,
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
            element:
              import.meta.env.VITE_ENV_STAGE === "test" ? (
                <EditPublicListing />
              ) : (
                <ComingSoon />
              ),
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

          {
            path: "DashboardSocial",
            element: <DashboardSocial />,
          },
          {
            path: "DashboardDirectory",
            element: <DashboardDirectory />,
          },
          {
            path: "bestpractices",
            element:
              import.meta.env.VITE_ENV_STAGE === "test" ? (
                <BestPracticesHub />
              ) : (
                <ComingSoon />
              ),
          },
          {
            path: "bestpractices/:id/:slug",
            element: <SingleBP />,
          },

          {
            path: "manage_bestpractices",
            element: <ManageBestPractices />,
          },

          {
            path: "DashboardDirectory/technology",
            element: <DashboardTechnology />, // reuse or wrap TechnologyAndAI
          },
        ],
>>>>>>> Stashed changes
      },
      // {
      //   path: 'score-result',
      //   element: <ScoreResult />,
      // },
      // {
      //   path: 'user-profile',
      //   element: <UserProfilePage />,
      // },

      //  {
      //   path: 'company-profile',
      //   element: <OrganaizationProfilepage />,
      // },

{
  path:'public_companyprofile',
  element:<PublicCompanyProfile />,
},

{
  path:'user_profileview',
  element:<UserProfileView />,
},


    ],

  },
  {
  path: '/terms-and-conditions',
  element: <TermsAndConditions />,
},
<<<<<<< Updated upstream
=======
  
  {
    path: "directory",
    children: [
      {
        index: true,
        element:
          import.meta.env.VITE_ENV_STAGE === "test" ? (
            <DirectoryPage />
          ) : (
            <ComingSoon />
          ),
      },
>>>>>>> Stashed changes

  {
  path: '/privacy-policy',
  element: <PrivacyPolicy />,
},
  {
    path: '/email-verify',
    element: <EmailVerify />,
  },
  {
    path: '/payment-confirmation',
    element: <PaymentVerify />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
<<<<<<< Updated upstream
=======
  {
    path: "/log-in",
    element: <Login />,
    handle: {
      passProps: true,
    },
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },

  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: '/email-verify',
    element: <EmailVerify />,
  },
  {
    path: '/payment-confirmation',
    element: <PaymentVerify />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
>>>>>>> Stashed changes
]);
