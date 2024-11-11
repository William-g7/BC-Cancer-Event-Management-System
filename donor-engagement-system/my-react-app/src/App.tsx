// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from "./components/LoginPage.tsx";
import DashboardPage from "./components/DashboardPage.tsx";
import EventPage from "./components/EventPage.tsx";
import DonorSelectionPage from "./components/DonorSelectionPage.tsx";
import DonorNotePage from "./components/DonorNotePage.tsx"; // 导入 DonorNotePage
import EventListPage from "./components/EventListPage.tsx";
import CreateEvent from "./components/CreateEvent.tsx";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme.ts';

const isAuthenticated = () => {
  return !!localStorage.getItem('user');
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
}

const MainContent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={isAuthenticated() ? <LoginPage />: <Navigate to="/login" />} />
        <Route path="/:username/dashboard" element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />} /> 
        <Route path="/:username/events" element={isAuthenticated() ? <EventListPage /> : <Navigate to="/login" />} />
        <Route path="/:username/events/create" element={isAuthenticated() ? <CreateEvent /> : <Navigate to="/login" />} />
        <Route path="/:username/dashboard/event/:id" element={isAuthenticated() ? <EventPage /> : <Navigate to="/login" />} />  
        <Route path="/:username/dashboard/event/:id/donor-selection" element={isAuthenticated() ? <DonorSelectionPage /> : <Navigate to="/login" />} />
        <Route path="/donor/:id" element={<DonorNotePage />} /> {/* 设置 DonorNotePage 路由 */}
      </Routes>
    </div>
  );
};

export default App;
