import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'

const HomePage = lazy(() => import('../pages/Home'))
const AboutPage = lazy(() => import('../pages/About'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

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
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
])