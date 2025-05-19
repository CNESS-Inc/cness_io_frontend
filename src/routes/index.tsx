import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import EmailVerify from '../components/ui/EmailVerify';

const HomePage = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ScoreResult = lazy(() => import('../components/sections/DashboardSection/ScoreResult'));

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
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'score-result',
        element: <ScoreResult />,
      },
    ],
  },
  {
    path: '/email-verify',
    element: <EmailVerify />,
  },
]);
