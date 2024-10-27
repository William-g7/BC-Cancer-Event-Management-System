import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; 
import LoginPage from "./components/LoginPage.tsx"; // Import LoginPage
import DashboardPage from "./components/DashboardPage.tsx"; // Import DashboardPage
import EventCard from "./components/EventCard.tsx"; // Import EventCard
import Notification from "./components/Notification.tsx"; // Import Notification
import Header from "./components/Header.tsx"; // Import Header

const App: React.FC = () => {
  return (
   <Router>
      <MainContent />
  </Router>
  );
}

const MainContent: React.FC = () => {
  const location = useLocation(); // Get the current location (URL path)

  return (
    <div style={{marginRight: '500px'}}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> 
        <Route path="/event/:id" element={<EventCard />} /> 
      </Routes>

    </div>
  );
};

export default App;
