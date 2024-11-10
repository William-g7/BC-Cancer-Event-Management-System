import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import { EventService } from '../services/eventService.ts';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    address: '',
    city: '',
    description: '',
    expected_selection: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const eventService = new EventService();
      const completeEventData = {
        name: eventData.name,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: `${eventData.address}, ${eventData.city}`,
        description: eventData.description,
        expected_selection: parseInt(eventData.expected_selection),
      };
      await eventService.createEvent(completeEventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
      {/* Sidebar */}
      <Box sx={{ width: '250px' }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* Header */}
        <Box sx={{ position: 'absolute',  right: 40 }}>
          <Header />
        </Box>

        {/* Title Section */}
        <Box sx={{ mb: 4, mt: 16 }}>
          <Typography variant="h4">
            CREATE EVENT
          </Typography>
        </Box>

        <Box sx={{ width: '80%', marginTop: '70px', marginRight: '20px' }}>
          <Grid container spacing={2}>

            <Grid container spacing={4} sx={{ marginBottom: '15px' }}>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>Name</Typography>
                <TextField
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>Starting time</Typography>
                <TextField
                  name="start_time"
                  type="datetime-local"
                  value={eventData.start_time}
                  onChange={handleChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>End time</Typography>
                <TextField
                  name="end_time"
                  type="datetime-local"
                  value={eventData.end_time}
                  onChange={handleChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ marginBottom: '15px' }}>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>Address</Typography>
                <TextField
                  name="address"
                  value={eventData.address}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>City</Typography>
                <TextField
                  name="city"
                  value={eventData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle2" color="black" fontSize={20}>Number of invitation</Typography>
                <TextField
                  name="expected_selection"
                  type="number"
                  value={eventData.expected_selection}
                  onChange={handleChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="black" fontSize={20}>Description</Typography>
              <TextField
                name="description"
                value={eventData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '10px 30px',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                Confirm Creation
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateEvent;
