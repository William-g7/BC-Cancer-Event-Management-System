import React from "react";
import { Box, Button } from '@mui/material';
import EventList from "./EventList.tsx";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const EventListPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

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

                <Box sx={{ 
                    marginTop: '64px', 
                    marginLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2 
                }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateEvent}
                        sx={{
                            alignSelf: 'flex-start',
                            backgroundColor: 'black',
                            '&:hover': {
                                backgroundColor: '#333'
                            }
                        }}
                    >
                        Create Event
                    </Button>
                    <EventList />
                </Box>
            </Box>
        </Box>
    );
};

export default EventListPage;