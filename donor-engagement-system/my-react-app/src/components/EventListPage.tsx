import React from "react";
import { Box, Button, Typography} from '@mui/material';
import EventList from "./EventList.tsx";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme/theme.ts';

const EventListPage: React.FC = () => {
    const userRole = localStorage.getItem('role') || null;
    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
            <Box sx={{ width: { xs: '60px', lg: '200px' }, flexShrink: 0 }}>
                <Sidebar />
            </Box>

            {/* Main content */}
            <Box sx={{ 
                flexGrow: 1,
                overflow: 'auto',
                position: 'relative',
                marginLeft: { xs: '10px', sm: '20px', md: '40px' },
            }}>
            {/* Main content with max width */}
            
                {/* Header */}
                
                <Box sx={{ 
                    position: 'absolute',
                    right: 40 
                }}>
                    <Header />
                </Box>
                


                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 16 }}>
                    <Typography variant="h4">
                        EVENTS
                    </Typography>
                    {userRole == 'Fundraiser' && (
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
                 )}
                </Box>

                <Box sx={{ 
                    mt: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    
                    <EventList role={userRole} />
                </Box >
                
            </Box>
        </Box>
        
    );
};

export default EventListPage;