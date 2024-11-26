// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import EventPage from "./pages/EventPage.tsx";
import DonorSelectionPage from "./pages/DonorSelectionPage.tsx";
import DonorNotePage from "./pages/DonorNotePage.tsx";
import EventListPage from "./pages/EventListPage.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme.ts';
import CalendarPage from './pages/CalendarPage.tsx';
import DonorSelectionReviewPage from './pages/DonorSelectionReviewPage.tsx';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('username'); 

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} /> 
          <Route path="/events" element={isAuthenticated ? <EventListPage /> : <Navigate to="/login" />} />
          <Route path="/events/create" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />
          <Route path="/event/:id" element={isAuthenticated ? <EventPage /> : <Navigate to="/login" />} /> 
          <Route path="/event/:id/selections" element={isAuthenticated ? <DonorSelectionPage /> : <Navigate to="/login" />} />
          <Route path="/donor/:id" element={isAuthenticated ? <DonorNotePage /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />} />
          <Route path="/event/:id/selections/review" element={isAuthenticated ? <DonorSelectionReviewPage /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
