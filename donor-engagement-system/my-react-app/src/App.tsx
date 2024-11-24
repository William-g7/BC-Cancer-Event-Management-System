// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from "./components/LoginPage.tsx";
import DashboardPage from "./components/DashboardPage.tsx";
import EventPage from "./components/EventPage.tsx";
import DonorSelectionPage from "./components/DonorSelectionPage.tsx";
import DonorNotePage from "./components/DonorNotePage.tsx";
import EventListPage from "./components/EventListPage.tsx";
import CreateEvent from "./components/CreateEvent.tsx";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme.ts';
import CalendarPage from './components/CalendarPage.tsx';


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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
