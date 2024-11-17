import React from 'react';
import { Box } from '@mui/system';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import EventDetail from './EventDetail.tsx';
import { useMediaQuery } from '@mui/material';
import { theme } from '../theme/theme.ts';

const EventPage: React.FC = () => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white'}}>
            <Box sx={{ width: { xs: '60px', lg: '200px' }, flexShrink: 0 }}>
                <Sidebar />
            </Box>

            {/* Main content */}
            <Box sx={{ 
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Box sx={{ 
                flexGrow: 1,
                overflow: 'auto',
                position: 'relative',
                marginLeft: { xs: '10px', sm: '20px', md: '40px' },
            }}>
               
               <Box sx={{ 
                position: 'absolute', 
                right: 40
                }}>
                    <Header />
                </Box>
        


                {/* Event Detail Content */}
                <Box sx={{ position: 'relative', mt:16}}>
                    <EventDetail />
                </Box>
            </Box>
        </Box>
    </Box>
    );
}

export default EventPage;

