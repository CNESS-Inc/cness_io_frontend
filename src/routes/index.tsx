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
import CourseDetail from "../pages/CourseDetail";
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
import Certification from "../pages/Certification";
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
import MyCollections from "../pages/MyCollections";
import Library from "../pages/Library";
import ContinueWatching from "../pages/ContinueWatching";
//import SellerDashboard from "../pages/SellerDashboard";
import UserPublicProfile from "../pages/UserPublicProfile";
import Affiliate from "../pages/Affiliate";
import ProductDetail from "../pages/ProductDetail";
import MPSearch from "../pages/MPsearch";
import AssessmentCertification from "../pages/AssessmentCertifications";
import AspiringAssessment from "../pages/AspiringAssessment";
import InspiredAssessment from "../pages/InspiredAssessment";
import ShopDetail from "../pages/ShopDetail";
import ReviewAll from "../pages/ReviewAll";
import CartPage from "../pages/CartPage";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import Wishlist from "../pages/Wishlist";
import OrderHistory from "../pages/OrderHistory";
import ProductSummery from "../pages/ProductSummery";
import Category from "../pages/Category";
import ShopsList from "../pages/Shops";
import VendorDashboard from "../pages/VendorDashboard";
import CreateShopForm from "../pages/CreateShopForm";
import SellerProductList from "../pages/SellerProductList";
import Preview from "../pages/Preview";
import AddVideoForm from "../pages/AddVideo";
import AddPodcastsForm from "../pages/AddPodcasts";
import AddEbookForm from "../pages/AddEbook";
import AddMusicForm from "../pages/AddMusic";
import AddCourseForm from "../pages/AddCourse";
import AddArtsForm from "../pages/AddArts";
import SellerOrderList from "../pages/SellerOrderList";
import SellerOrderDetail from "../pages/SellerOrderDetail";
import SellerSales from "../pages/SellerSales";
import SellerHelp from "../pages/SellerHelp";
import DashboardFaqs from "../pages/DashboardFaqs";
import SellerWithdrawal from "../pages/SellerWithdrawal";
import Wallet from "../pages/Wallet";
import AudioPreview from "../pages/MusicPreview";
import PodcastPreview from "../pages/PodcastPreview";
import EbookPreview from "../pages/EbookPreview";
import CoursePreview from "../pages/CoursePreview";
import ArtPreview from "../pages/ArtPreview";
import EditSellerProductPage from "../pages/EditSellerProductPage";
import PaymentConfirmation from "../pages/PaymentConfirmation";
import BestPracticeSearch from "../pages/BestPracticeSearch";
import CollectionDetail from "../pages/CollectionDetail";
import EditProfile from "../pages/EditProfile";

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
        path: "whycness",
        element: <WhyCness />,
      },

      {
        path: "social",
        element: <Social />,
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
            path: "MyCollection/:id",
            element: <Mycollectionview />,
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
            path: "wallet",
            element: <Wallet />,
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
            path: "marketplace",
            element: <MarketPlace />,
          },
          {
            path: "market-place",
            element: <MarketPlaceNew />,
          },
          {
            path: "collections",
            element: <MyCollections />,
          },
          {
            path: "my-collections/:id",
            element: <CollectionDetail />,
          },
          {
            path: "library",
            element: <Library />,
          },
          {
            path: "continue-watching",
            element: <ContinueWatching />,
          },
          {
            path: "market-place/search",
            element: <MPSearch />, // ← new page
          },

          {
            path: "categories",
            element: <Category />,
          },

          {
            path: "product-detail/:id",
            element: <ProductDetail />,
          },

          {
            path: "shop-detail/:id",
            element: <ShopDetail />,
          },

          {
            path: "product-review/:id",
            element: <ReviewAll />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "market-place/checkout-confirmation",
            element: <PaymentConfirmation />,
          },
          {
            path: "payment-success",
            element: <PaymentSuccess />,
          },
          {
            path: "payment-failed",
            element: <PaymentFailed />,
          },
          {
            path: "wishlist",
            element: <Wishlist />,
          },
          {
            path: "order-history",
            element: <OrderHistory />,
          },
          {
            path: "order-history/:id",
            element: <ProductSummery />,
          },
          {
            path: "shops",
            element: <ShopsList />,
          },

          {
            path: "seller-dashboard",
            element: <VendorDashboard />,
          },

          {
            path: "createshop",
            element: <CreateShopForm />,
          },
          {
            path: "products",
            element: <SellerProductList />,
          },
          {
            path: "products/add-video",
            element: <AddVideoForm />,
          },
          {
            path: "products/add-podcast",
            element: <AddPodcastsForm />,
          },
          {
            path: "products/add-ebook",
            element: <AddEbookForm />,
          },
          {
            path: "products/add-music",
            element: <AddMusicForm />,
          },

          {
            path: "products/add-course",
            element: <AddCourseForm />,
          },

          {
            path: "products/add-arts",
            element: <AddArtsForm />,
          },
          {
            path: "products/edit/:productNo",
            element: <EditSellerProductPage />,
          },
          {
            path: "products/preview/:productNo",
            element: <Preview />,
          },
          {
            path: "products/music-preview/:productNo",
            element: <AudioPreview />,
          },
          {
            path: "products/podcast-preview/:productNo",
            element: <PodcastPreview />,
          },
          {
            path: "products/ebook-preview/:productNo",
            element: <EbookPreview />,
          },
          {
            path: "products/course-preview/:productNo",
            element: <CoursePreview />,
          },
          {
            path: "products/art-preview/:productNo",
            element: <ArtPreview />,
          },

          {
            path: "orderlist",
            element: <SellerOrderList />,
          },
          {
            path: "seller-sales",
            element: <SellerSales />,
          },
          {
            path: "seller-help",
            element: <SellerHelp />,
          },
          {
            path: "faqs",
            element: <DashboardFaqs />,
          },

          {
            path: "seller-sales/withdrawal",
            element: <SellerWithdrawal />,
          },

          {
            path: "orderlist/:id",
            element: <SellerOrderDetail />,
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
            element: <UserPublicProfile />,
          },
          {
            path: "digital_products",
            element: <DigitalProducts />,
          },

          {
            path: "library/course/:id",
            element: <CourseDetail />,
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
  path: "Profile/editprofile",
  element: <EditProfile />,
},

          {
            path: "MyConnection",
            element: <MyConnection />,
          },
           {
            path: "Certification",
            element: <Certification />,
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
            path: "search-bestpractices",
            element: <BestPracticeSearch />,
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
