import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import DashboardEvents from './DashboardEvents.tsx';
import Notification from './Notification.tsx';
import { theme } from '../theme/theme.ts';
import Todo from './todo.tsx';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
      {/* Sidebar */}
      <Box sx={{ width: '250px' }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, marginLeft: '40px', marginRight:'30px', position: 'relative' }}>
        {/* Header */}
        <Box sx={{ position: 'absolute',  right: 40 }}>
          <Header />
        </Box>

        {/* Title Section */}
        <Box sx={{ mb: 4, mt: 16 }}>
          <Typography variant="h4">
            FUNDRAISER DASHBOARD
          </Typography>
        </Box>

        {/* Content Container */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          mt: 5
        }}>
          {/* Events Section - Takes up more space */}
          <Box sx={{ 
            flex: '1 1 auto',
            bgcolor: theme.palette.lightgrey.main,
            borderRadius: 4,
            p: 3
          }}>
            <DashboardEvents />
          </Box>

          {/* Notifications and do do list Section - Takes up less space */}
          <Box sx={{ 
            flex: '0 0 348px',
            bgcolor: theme.palette.lightgrey.main,
            borderRadius: 4,
            p: 3
          }}>
            <Todo />
            <Notification />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
