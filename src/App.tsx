import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboadOverview } from "./screens/DashboadOverview/DashboadOverview";
import { CnessFinalVersion } from "./routes/WireframeByAnima/screens/CnessFinalVersion";
//import { DashboardOverview as NavBarByAnimaDashboard } from "./routes/NavBarByAnima/screens/DashboardOverview";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CnessFinalVersion />} />
        <Route path="/dashboard" element={<DashboadOverview />} />
        <Route path="/home" element={<CnessFinalVersion />} />
      </Routes>
    </Router>
  );
};

export default App;
