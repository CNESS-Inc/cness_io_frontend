import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom'; // ✅ add this
import { router } from './routes'; // ✅ this must point to your router config

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} /> {/* ✅ this enables /directory route */}
  </StrictMode>
);
