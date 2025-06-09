import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom'; // ✅ add this
import { router } from './routes'; // ✅ this must point to your router config
import { ToastProvider } from './components/ui/Toast/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <>
   {/* <StrictMode> */}
   <ToastProvider>
    <RouterProvider router={router} /> {/* ✅ this enables /directory route */}
    </ToastProvider>
   {/* </StrictMode> */}
  </>
);
