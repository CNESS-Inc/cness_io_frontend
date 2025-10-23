import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import EmailVerify from "../components/ui/EmailVerify";
import PaymentVerify from "../components/ui/PaymentVerify";
import ResetPassword from "../components/ui/ResetPassword";
//import Why from "../pages/Why";
// import What from "../pages/What";
import GenerateBadgeCode from "../pages/GenerateBadgeCode";
import GenerateAffiliateCode from "../pages/GenerateAffiliateCode";
import AssessmentQuestion from "../pages/AssessmentQuestion";
import Setting from "../pages/Setting";
//import What from "../pages/What";
// import Social from "../pages/Social";
import Social from "../pages/Social";
// import SinglePost from "../components/Social/SinglePost";
// import ReelsCard from "../components/Social/Reels/ReelsCard";
import About from "../pages/About";
// import SocialLayout from "../layout/SocialLayout";
import UploadProof from "../pages/UploadProof";
import LearningLab from "../pages/LearningLab";
import UpgradeBadge from "../pages/UpgradeBadge";
import DirectoryProfile from "../pages/DirectoryProfile";
import Notification from "../pages/Notification";
import Support from "../pages/Support";
import MarketPlaceNew from "../pages/MarketPlaceNew";
import MarketPlace from "../pages/MarketPlace";

import SearchListing from "../pages/SearchListing";
import DigitalProducts from "../pages/DigitalProducts";
// import Feed from "../pages/Feed";
import SearchExplore from "../pages/SearchExplore";
import BecomeMentor from "../pages/BecomeMentorNew";
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
//import DashboardUserProfile from "../pages/DashboardUserProfile";
import CommunityGuidelines from "../pages/CommunityGuidelines";
import { StoriesApp } from "../components/Social/Story/StoryApp";
import Trendingpost from "../pages/TrendingPost";
import Mycollectionview from "../pages/Mycollectionview";
import TrendingAI from "../pages/TrendingAI";
import BecomePartner from "../pages/BecomePartner";
import Pricing from "../pages/Pricing";
import TopicPost from "../pages/TopicPost";
import CnessMarketplace from "../pages/CnessMarketplace";
import Certifications from "../pages/Certifications";
import Faqs from "../pages/Faqs";
import EcoSystem from "../pages/EcoSystem";
import Premium from "../pages/Premium";
import WhyCness from "../pages/WhyCness";
//import SellerDashboard from "../pages/SellerDashboard";
import UserPublicProfile from "../pages/UserPublicProfile";
import Affiliate from "../pages/Affiliate";
import ProductDetail from "../pages/ProductDetail";
import MPSearch from "../pages/MPsearch";
import AssessmentCertification from "../pages/AssessmentCertidications";
import AspiringAssessment from "../pages/AspiringAssessment";
import InspiredAssessment from "../pages/InspiredAssessment";

// Lazy-loaded pages
const HomePage = lazy(() => import("../pages/Home"));
const DirectoryPage = lazy(() => import("../pages/DirectoryPage"));
//const Dashboard = lazy(() => import("../pages/Dashboard"));
const SellerDashboard = lazy(() => import("../pages/SellerDashboard"));
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
// const UserProfileView = lazy(() => import("../pages/UserProfileView"));
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

      //{
      // // path: "why",
       // element: <Why />,
      //},
      // {
      //   path: "what",
      //   element: <What />,
      // },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "certifications",
        element: <Certifications />,
      },
      {
        path: "ecosystem",
        element: <EcoSystem />,
      },
      {
        path: "faq",
        element: <Faqs />,
      },
      {
        path: "comingSoon",
        element: <ComingSoon />,
      },

      {
        path: "cness-marketplace",
        element: <CnessMarketplace />,
      },
    {
      path: "premium",
      element: <Premium />,
    },
    {
      path:"whycness",
      element:<WhyCness />
    },
      {
      
        path: "dashboard",
        element: <DashboardLayout />, // ✅ now it's wrapped!
        children: [
          {
            index: true,
            //element: <Dashboard />,
            element: <SellerDashboard />,
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
            path: "user-profile/:id",
            element: <UserPublicProfile />,
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
            path: "assesmentcertification",
            element: <AssessmentCertification />,
          },
          {
            path: "aspiring-assessment",
            element: <AspiringAssessment />,
          },

          {
            path: "inspired-assessment",
            element: <InspiredAssessment />,
          },
          {
            path: "setting",
            element: (
              // import.meta.env.VITE_ENV_STAGE === "test" ? (
              <Setting />
            ),
            // ) : (
            //   <ComingSoon />
            // ),
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
          //old marketplacepage
          {
            path:"marketplace",
            element:<MarketPlace />,
          },
          {
            path: "market-place",
            element: <MarketPlaceNew />,
          },
          {
  path: "market-place/search",
  element: <MPSearch />, // ← new page
},

          {
           path: "product-detail/:id",
            element: <ProductDetail />,
          },
          // {
          //   path: "search-listing",
          //   element:
          //     import.meta.env.VITE_ENV_STAGE === "test" ? (
          //       <SearchListing />
          //     ) : (
          //       <ComingSoon />
          //     ),
          // },
          {
            path: "search-listing",
            element: <SearchListing />,
          },
          {
            path: "userprofile/:id",
            //element: <DashboardUserProfile />,
            element:<UserPublicProfile />,
          },
          {
            path: "digital_products",
            element: <DigitalProducts />,
          },

          {
            path: "Feed",
            element: <DashboardSocial />,
          },

          {
            path: "trendingpost",
            children: [
              {
                index: true,
                element: <Trendingpost />,
              },
              {
                path: "trendingai",
                element: <TrendingAI />,
              },
            ],
          },
          {
            path: ":slug",
            element: <TopicPost />,
          },

          {
            path: "SearchExplore",
            element: <SearchExplore />,
          },
          {
            path: "become-mentor",
            element: <BecomeMentor />,
          },
          {
            path: "Become_partner",
            element: <BecomePartner />,
          },
          {
            path: "affiliate",
            element: <Affiliate />,
          },
          {
            path: "GenerateBadgeCode",
            element: <GenerateBadgeCode />,
          },
          {
            path: "GenerateAffiliateCode",
            element: <GenerateAffiliateCode />,
          },
          {
            path: "UploadProof",
            element: <UploadProof />,
          },
          {
            path: "EditPublicListing",
            element: (
              // import.meta.env.VITE_ENV_STAGE === "test" ? (
              <EditPublicListing />
            ),
            // ) : (
            //   <ComingSoon />
            // ),
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
            path: "Profile/:id?",
            element: <Profile />,
          },

          {
            path: "MyCollection/:id",
            element: <Mycollectionview />,
          },
          {
            path: "MyConnection",
            element: <MyConnection />,
          },
          {
            path: "comingSoon",
            element: <ComingSoon />,
          },

          {
            path: "feed",
            element: <DashboardSocial />,
          },
          {
            path: "DashboardDirectory",
            element: <DashboardDirectory />,
          },
          {
            path: "bestpractices",
            element: <BestPracticesHub />,
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
      },
    ],
  },
  {
    path: "directory",
    children: [
      {
        index: true,
        element: <DirectoryPage />, // ✅ now it's wrapped!
      },

      {
        path: "company-profile/:id",
        element: <PublicCompanyProfile />,
      },

      {
        path: "user-profile/:id",
        element: <UserPublicProfile />,
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
    path: "story-design",
    children: [
      {
        index: true,
        element: <StoriesApp />, // ✅ now it's wrapped!
      },
    ],
  },
  /*{
    path: "social",
    element: <SocialLayout />,
    children: [
      {
        index: true,
        element: (
          // import.meta.env.VITE_ENV_STAGE === "test" ? (
          <Social />
        ),
        // ) : (
        //   <ComingSoon />
        // ),
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
  },*/
  {
    path: "social",
    element: <Social />,
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
    path: "/community-guidelines",
    element: <CommunityGuidelines />,
  },

  {
    path: "/sign-up",
    element: <Signingup />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
]);
