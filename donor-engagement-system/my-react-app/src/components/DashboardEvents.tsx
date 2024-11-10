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
    navigate(`/event/${id}`);
  };

  return (
    <Box sx={{ width: '930px' }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Your Upcoming Events
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%'
        }}>
          {events.map((event) => (
            <Box 
              key={event.id}
              sx={{
                flex: '1 1 270px',
                minWidth: '270px',
                maxWidth: 'calc(33.333% - 16px)'
              }}
            >
              <Card 
                onClick={() => handleEventClick(event.id)}
                sx={{ cursor: 'pointer' }}
                style={{border: "none", boxShadow: "none"}}
              >
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
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DashboardEvents;



