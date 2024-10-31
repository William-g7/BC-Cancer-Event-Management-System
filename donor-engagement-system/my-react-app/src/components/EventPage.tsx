import React from 'react';
import { Box } from '@mui/system';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import EventTable from './EventTable.tsx';


const EventPage: React.FC = () => {
    
    return (
        <Box sx={{ display: "flex" }}>
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
        </Box>
          <EventTable />
         </Box>
    );
}

export default EventPage;

