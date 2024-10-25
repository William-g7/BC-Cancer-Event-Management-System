import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import Events from './Events.tsx';
import Notification from './Notification.tsx';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', marginRight: 0 }}>
      <Box
        sx={{
          width: '250px', // Sidebar width
        }}
      >
        <Sidebar />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header at the top right of the page */}
        <Box
          sx={{
            justifyContent: 'flex-end', // Aligns the header to the right
            display: 'flex',
            position: 'fixed', // Change to fixed to cover the whole page
            top: 20, // Ensure it is at the top
            right: 0, // Align to the right
            marginRight: '15px',
          }}
        > 
          <Header />
        </Box>

        {/* Content area with Events and Notification */}
        <Grid container spacing={2} sx={{ marginTop: '64px', marginLeft: '-30px'}}> {/* Adjust margin to avoid overlap with fixed header */}
          {/* Events area */}
          <Typography variant="h4" sx={{ marginBottom: 2, marginLeft: '10px' }}>
            FUNDRAISER DASHBOARD
            </Typography>
          <Grid item xs={12}>
            <Events />
          </Grid>

          {/* Notification area */}
          <Grid>
            <Box
              sx={{
                width: '280px',
                borderColor: 'transparent',
                display: 'flex',
                position: 'fixed', // Change to fixed to cover the whole page
                top: 150, // Ensure it is at the top
                right: 0, // Align to the right
                marginRight: '0px',
            
              }}
            >
              <Notification />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  
  );
};

export default DashboardPage;
