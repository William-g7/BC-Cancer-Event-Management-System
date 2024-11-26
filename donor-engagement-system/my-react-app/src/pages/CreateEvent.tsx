import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import { EventService } from '../services/eventService.ts';
import { theme } from '../theme/theme.ts';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  // Get current date at 4 PM
  const defaultDateTime = new Date();
  defaultDateTime.setHours(16, 0, 0, 0); // Set to 4:00:00 PM
  
  const [eventData, setEventData] = useState({
    name: '',
    start_time: defaultDateTime.toISOString().slice(0, 16), // Format: "YYYY-MM-DDThh:mm"
    end_time: defaultDateTime.toISOString().slice(0, 16), // Format: "YYYY-MM-DDThh:mm"
    address: '',
    city: '',
    description: '',
    expected_selection: '',
    participant_goal: '' // Ensure this is initialized
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = {
      name: 'Name',
      start_time: 'Starting time',
      end_time: 'End time',
      address: 'Address',
      city: 'City',
      expected_selection: 'Number of invitation',
      participant_goal: 'Participant goal'
    };

    // Check for empty fields
    const emptyFields = Object.entries(requiredFields).filter(
      ([key]) => !eventData[key]
    ).map(([_, label]) => label);

    if (emptyFields.length > 0) {
      alert(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
      return;
    }

    // Validate date/time logic
    const startDate = new Date(eventData.start_time);
    const endDate = new Date(eventData.end_time);
    
    if (endDate <= startDate) {
      alert('End time must be after start time');
      return;
    }

    // Validate number of invitations
    if (isNaN(parseInt(eventData.expected_selection)) || parseInt(eventData.expected_selection) <= 0) {
      alert('Please enter a valid number of invitations');
      return;
    }

    try {
      const eventService = new EventService();
      const completeEventData = {
        name: eventData.name,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: `${eventData.address}, ${eventData.city}`,
        description: eventData.description || '', // Handle optional description
        expected_selection: parseInt(eventData.expected_selection || '0'),
        participant_goal: parseInt(eventData.participant_goal || '0') // Ensure it's parsed correctly
      };
      
      console.log('Complete Event Data:', completeEventData); // Add logging
      navigate('/events');
      await eventService.createEvent(completeEventData);
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  // Add this near the top of your component, after imports
  const cityOptions = [
    'Vancouver',
    'Burnaby',
    'Richmond',
    'Surrey',
    'Abbotsford',
    'Salmon Arm',
    'Parksville',
    'Saanich',
    'White Rock',
    'Kelowna',  
    'North Vancouver',
    'West Vancouver',
    'Coquitlam',
    'Port Coquitlam', 
    'New Westminster',
    'Vernon',
    'Langley',
    'Williams Lake',
    'Prince George',
    'Campbell River',
    'Courtenay',
  ];

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
        {/* Header */}
        <Box sx={{ position: 'absolute', right: 40 }}>
            <Header />
        </Box>

        {/* Title and button section */}
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 16,
            mb: 4  // Add margin bottom
        }}>
            <Typography variant="h4">NEW EVENT</Typography>
            <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                    backgroundColor: '#2C3E50',  // Dark blue color from image
                    color: 'white',
                    width: '210px',
                    height: '40px',
                    '&:hover': {
                        backgroundColor: theme.palette.darkpurple.main
                    }
                }}
            >
                CREATE EVENT
            </Button>
        </Box>

        {/* Form container */}
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                {/* First row */}
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>Name</Typography>
                    <TextField
                        name="name"
                        value={eventData.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                }
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>Starting time</Typography>
                    <TextField
                        name="start_time"
                        type="datetime-local"
                        value={eventData.start_time}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                    borderWidth: 1,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main,
                                    borderWidth: 3,
                                }
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>End time</Typography>
                    <TextField
                        name="end_time"
                        type="datetime-local"
                        value={eventData.end_time}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main, // Changes to dark purple when focused
                                    borderWidth: 3,   
                                }
                            }
                        }}
                    />
                </Grid>

                {/* Second row */}
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>Address</Typography>
                    <TextField
                        name="address"
                        value={eventData.address}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main, // Changes to dark purple when focused
                                    borderWidth: 3,
                                }
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>City</Typography>
                    <TextField
                        select
                        name="city"
                        value={eventData.city}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        SelectProps={{
                            native: true
                        }}
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main,
                                    borderWidth: 3,
                                }
                            }
                        }}
                    >
                        <option value="">Select a city</option>
                        {cityOptions.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>Number of invitation</Typography>
                    <TextField
                        name="expected_selection"
                        type="number"
                        value={eventData.expected_selection}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            inputProps: { 
                                min: 1 
                            }
                        }}
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main,
                                    borderWidth: 3,
                                }
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ mb: 1 }}>Participant goal</Typography>
                    <TextField
                        name="participant_goal"
                        type="number"
                        value={eventData.participant_goal}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            inputProps: { 
                                min: 1 
                            }
                        }}
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main,
                                    borderWidth: 3,
                                }
                            }
                        }}
                    />
                </Grid>

                {/* Description field */}
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1 }}>Description</Typography>
                    <TextField
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.grey[500],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.darkpurple.main, // Changes to dark purple when focused
                                    borderWidth: 3,
                                }
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    </Box>
  </Box>
  );
};

export default CreateEvent;
