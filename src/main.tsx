import { createRoot } from 'react-dom/client';
import clarity from "@microsoft/clarity";
import './index.css';

import { RouterProvider } from 'react-router-dom'; // ✅ add this
import { router } from './routes'; // ✅ this must point to your router config
import { ToastProvider } from './components/ui/Toast/ToastProvider';
import { GoogleOAuthProvider } from "@react-oauth/google";
const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;
clarity.init(clarityId);
const GOOGLE_CLIENT_ID = "250284924610-m8nc17asodpusamdg8910t8sck6acp16.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </GoogleOAuthProvider>
  </>
);
