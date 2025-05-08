import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboadOverview from './screens/DashboadOverview/DashboadOverview'; // keep the path exactly as your folder name
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboadOverview />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);