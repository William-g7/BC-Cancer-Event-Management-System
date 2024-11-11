import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Card, CardContent, CardMedia, Box, CircularProgress } from "@mui/material";
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';

const eventService = new EventService();

const DashboardEvents: React.FC = () => {
  const navigate = useNavigate();
  const fetchEvents = useCallback(() => eventService.getDashboardEvents(), []);
  const { events, loading, error } = useEvents(fetchEvents);

  const handleEventClick = (id: number) => {
    const username = localStorage.getItem('username'); // Retrieve username from local storage  
    navigate(`/${username}/dashboard/event/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2, marginLeft: '0px' }}>
        Your Upcoming Events
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card onClick={() => handleEventClick(event.id)}
                  sx={{ cursor: 'pointer' }}
                  style={{border: "none", boxShadow: "none"}}>
              <CardMedia
                component="img"
                alt={event.name}
                height="200"
                image="/calendar.png"
              />
              <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.start_time).toLocaleDateString()}
                </Typography>
                <Typography sx={{ fontSize: 16}}>{event.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DashboardEvents;



