import React from 'react';
import { Box } from '@mui/system';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import EventDetail from './EventDetail.tsx';

const EventPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            {/* Main content */}
            <Box sx={{ 
                flexGrow: 1, 
                marginLeft: '30px',
                marginRight: '30px'
            }}>
                {/* Header */}
                <Box sx={{ position: 'absolute', right: 40 }}>
                    <Header />
                </Box>

                {/* Event Detail Content */}
                <Box sx={{ mt: 16 }}>
                    <EventDetail />
                </Box>
            </Box>
        </Box>
    );
}

export default EventPage;

