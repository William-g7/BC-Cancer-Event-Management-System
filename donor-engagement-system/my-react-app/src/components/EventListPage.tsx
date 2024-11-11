import React from "react";
import { Box, Button, Typography } from '@mui/material';
import EventList from "./EventList.tsx";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme/theme.ts';

const EventListPage: React.FC = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleCreateEvent = () => {
        navigate(`/${username}/events/create`);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, p: 4 }}>
                {/* Header */}
                <Box sx={{ position: 'absolute',  right: 40 }}>
                    <Header />
                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 12 }}>
                    <Typography variant="h4">
                        EVENTS
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateEvent}
                        sx={{
                            width: '210px',
                            height: '40px',
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.darkpurple.main
                            }
                        }}
                    >
                        Create Event
                    </Button>
                </Box>

                <Box sx={{ 
                    mt: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2 
                }}>
                    
                    <EventList />
                </Box >
                
            </Box>
        </Box>
    );
};

export default EventListPage;