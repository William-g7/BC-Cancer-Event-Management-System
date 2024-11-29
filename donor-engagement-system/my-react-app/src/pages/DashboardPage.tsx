import React from 'react';
import { Box, Typography} from '@mui/material';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import  CoordinatorDashboard  from '../components/CoordinatorDashboard.tsx';
import  DashboardEvents  from '../components/DashboardEvents.tsx';
import Notification from '../components/Notification.tsx';
import { theme } from '../theme/theme.ts';
import Todo from '../components/todo.tsx';
import Feedback from '../components/Feedback.tsx';

const DashboardPage: React.FC = () => {
  const role = localStorage.getItem('role');
  

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: { xs: '60px', lg: '200px' },
        flexShrink: 0
      }}>
        <Sidebar />
      </Box>

      {/* Main content wrapper for centering */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        
      }}>
        {/* Main content with max width */}
        <Box sx={{ 
                  flexGrow: 1,
                  width: '100%',
                  overflow: 'auto',
                  position: 'relative',
                  marginLeft: { xs: '10px', sm: '20px', md: '40px' },
                  marginRight: { xs: '10px', sm: '20px', md: '20px' },
              }}>
            {/* Header */}
              <Header />
          
          
          {/* Title Section */}
          <Box sx={{ mb: 4, mt: 16, marginTop: 5 }}>
            <Typography variant="h4">
              {role === 'Coordinator' ? 'COORDINATOR DASHBOARD' : 'FUNDRAISER DASHBOARD'}
            </Typography>
          </Box>

          {/* Content Container */}
          <Box sx={{ 
            flexGrow: 1,
            flexShrink: 1,
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            gap: { xs: 1, sm: 2, md: 3 },
            mt: { xs: 3, sm: 4, md: 5 },
            width: '100%'
          }}>
            {/* Events Section */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', sm: '1 1 auto', md: '1 1 auto', lg: '1 1 auto' },  
              bgcolor: theme.palette.lightgrey.main,
              borderRadius: 4,
              p: { xs: 2, sm: 1.5, md: 3 },
              minWidth: 0
            }}>
              {role === 'Coordinator' ? <CoordinatorDashboard /> : <DashboardEvents />}
            </Box>

            {/* Notifications or Recent Feedback Section */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', sm: '1 1 auto', md: '1 1 auto', lg: '0 0 330px' },
              bgcolor: theme.palette.lightgrey.main,
              borderRadius: 4,
              p: { xs: 2, sm: 2, md: 3 }
            }}>
              <Todo />
              {role === 'Coordinator' || role === 'EventLeader' ? <Feedback /> : <Notification />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;