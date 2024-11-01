import React from "react";
import { Box } from '@mui/material';
import EventList from "./EventList.tsx";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";

const EventListPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh', marginRight: 0 }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{
                    justifyContent: 'flex-end',
                    display: 'flex',
                    position: 'fixed',
                    top: 20,
                    right: 0,
                    marginRight: '15px',
                }}>
                    <Header />
                </Box>

                <Box sx={{ marginTop: '64px', marginLeft: '20px' }}>
                    <EventList />
                </Box>
            </Box>
        </Box>
    );
};

export default EventListPage;