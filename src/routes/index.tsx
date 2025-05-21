
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import EmailVerify from '../components/ui/EmailVerify';
const HomePage = lazy(() => import('../pages/Home'))
const DirectoryPage= lazy(()=> import('../pages/DirectoryPage'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ScoreResult = lazy(() => import('../components/sections/DashboardSection/ScoreResult'))
const UserProfilePage=lazy(()=>import('../components/sections/DashboardSection/UserProfilePage'))
const OrganaizationProfilepage=lazy(()=>import('../components/sections/DashboardSection/OrganizationProfile'))
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

       { path: 'directory', 
        element: <DirectoryPage /> 
      },

      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'score-result',
        element: <ScoreResult />,
      },
      {
        path: 'user-profile',
        element: <UserProfilePage />,
      },

       {
        path: 'company-profile',
        element: <OrganaizationProfilepage />,
      },
    ],
  },
  {
    path: '/email-verify',
    element: <EmailVerify />,
  },
]);
