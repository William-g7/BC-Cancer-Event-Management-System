import React from 'react';
import { Box, Typography} from '@mui/material';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import CalendarEvents from '../components/CalendarEvents.tsx';

 
const CalendarPage: React.FC = () => {
    const userRole = localStorage.getItem('role') || null;
    
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
            justifyContent: 'center'
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
        
                <Box sx={{
                        flexGrow: 1,
                        width: '100%',
                        overflow: 'auto',
                        position: 'relative',
                        marginTop: '20px',
                        marginLeft: { xs: '10px', sm: '20px', md: '40px' },
                    marginRight: { xs: '10px', sm: '20px', md: '20px' },
                }}>
                  <CalendarEvents role={userRole} />
                </Box>
              </Box>
            </Box>
        </Box>  
    
    )
}

    


export default CalendarPage;