import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from "./components/LoginPage.tsx"; // Import LoginPage
import DashboardPage from "./components/DashboardPage.tsx"; // Import DashboardPage
import EventPage from "./components/EventPage.tsx"; // Import EventPage
import DonorSelectionPage from "./components/DonorSelectionPage.tsx"; // Import DonorSelectionPage

const App: React.FC = () => {
  return (
   <Router>
      <MainContent />
  </Router>
  );
}

const MainContent: React.FC = () => {
  

  return (
    <div style={{marginRight: '500px'}}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> 
        <Route path="/events" element={<EventPage />} />
        <Route path="/event/:id" element={<EventPage />} /> 
        <Route path="/event/:id/donor-selection" element={<DonorSelectionPage />} />
      </Routes>

    </div>
  );
};

export default App;
