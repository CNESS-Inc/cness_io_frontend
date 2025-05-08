import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DashboadOverview from './screens/DashboadOverview/DashboadOverview';

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <DashboadOverview />
  </StrictMode>,
);

