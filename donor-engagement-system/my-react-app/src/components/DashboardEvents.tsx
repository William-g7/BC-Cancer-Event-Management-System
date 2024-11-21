import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Box, CircularProgress } from "@mui/material";
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';

const eventService = new EventService();

const DashboardEvents: React.FC = () => {
  const navigate = useNavigate();
  const fetchEvents = useCallback(() => eventService.getDashboardEvents(), []);
  const { events, loading, error } = useEvents(fetchEvents);

  // Sort events by starting date
  const sortedEvents = events.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const handleEventClick = (id: number) => {
    navigate(`/event/${id}`);
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      width: '100%',
      maxWidth: '100%'
    }}>
      <Typography variant="h5" sx={{ 
        marginBottom: 2,
        fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
      }}>
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
          gap: { xs: 1, sm: 2, md: 3 },
          width: '100%'
        }}>
          {sortedEvents.map((event) => (
            <Box 
              key={event.id}
              // sx={{
              //   width: {
              //     xs: '100%',
              //     sm: 'calc(50% - 8px)',
              //     lg: 'calc(33.33% - 16px)'
              //   },
              //   minWidth: {
              //     xs: '100%',
              //     sm: '200px',
              //     lg: '330px'
              //   },
              //   maxWidth: {
              //     sm: 'calc(50% - 8px)',
              //     lg: 'calc(33.33% - 16px)'
              //   },
                
              // }}
            >
              <Card 
                onClick={() => handleEventClick(event.id)}
                sx={{ 
                  cursor: 'pointer',
                  border: "none", 
                  boxShadow: "none",
                  height: '100%'
                }}
              >
                <CardMedia
                  component="img"
                  alt={event.name}
                  sx={{ 
                    height: { xs: 230, sm: 230, md: 235 },
                    width: 280
                  }}
                  image={event.image_url || '/calendar.png'}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  padding: { xs: 2, sm: 2, md: 2 }
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.start_time).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: { xs: 14, sm: 15, md: 16 }
                  }}>
                    {event.name}
                  </Typography>
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



