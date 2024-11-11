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
      <Box sx={{ 
        width: { xs: '60px', lg: '230px' },
        flexShrink: 0
      }}>
        <Sidebar />
      </Box>

      {/* Main content wrapper for centering */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center'
      }}>
        {/* Main content with max width */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '1440px',
          marginLeft: { xs: '10px', sm: '20px', md: '40px' },
          marginRight: { xs: '10px', sm: '20px', md: '40px' },
          overflow: 'auto',
          position: 'relative'
        }}>
          {/* Header */}
          <Box sx={{ 
            position: 'absolute', 
            right: { xs: '10px', sm: '20px', md: '40px' }
          }}>
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
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, sm: 2, md: 3 },
            mt: { xs: 3, sm: 4, md: 5 },
            width: '100%'
          }}>
            {/* Events Section */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', sm: '0 0 auto', md: '1 1 auto', lg: '1 1 auto' },
              bgcolor: theme.palette.lightgrey.main,
              borderRadius: 4,
              p: { xs: 2, sm: 2, md: 3 },
              minWidth: 0
            }}>
              <DashboardEvents />
            </Box>

            {/* Notifications Section */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', sm: '1 1 auto', md: '1 1 auto', lg: '0 0 330px' },
              bgcolor: theme.palette.lightgrey.main,
              borderRadius: 4,
              p: { xs: 2, sm: 2, md: 3 }
            }}>
              <Todo />
              <Notification />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
