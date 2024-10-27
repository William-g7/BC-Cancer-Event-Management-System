import React from 'react';
import { Box } from '@mui/system';
import Sidebar from './Sidebar';
import Header from './Header';
import EventCard from './EventCard';


const EventPage: React.FC = () => {
    return (
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Header />
          <EventCard />
         </Box>
    );
}

