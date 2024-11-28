import React from 'react';
import { Box } from '@mui/system';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import EventDetail from '../components/EventDetail.tsx';

const EventPage: React.FC = () => {

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white'}}>
            <Box sx={{ width: { xs: '60px', lg: '200px' }, flexShrink: 0 }}>
                <Sidebar />
            </Box>

            {/* Main content */}
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
        


                {/* Event Detail Content */}
                <Box sx={{ position: 'relative', mt:16, marginTop: 5
                    
                }}>
                    <EventDetail />
                </Box>
            </Box>
        </Box>
   
    );
}

export default EventPage;

