import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Box, CircularProgress } from "@mui/material";
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';
import { useEventsByStatus } from '../hooks/useEventsByStatus.ts';

const eventService = new EventService();

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { finishedEvents, waitingEvents, loading, error } = useEventsByStatus(
    () => eventService.getEventsByStatus()
  );

  const handleEventClick = (id: number) => {
    navigate(`/event/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100%', maxWidth: '100%' }}>
      {/* Finished Events Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ 
          marginBottom: 2,
          fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
        }}>
          Selection Finished Events
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
            {finishedEvents.map((event) => (
              <Box key={event.id}>
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

      {/* Waiting Events Section */}
      <Box>
        <Typography variant="h5" sx={{ 
          marginBottom: 2,
          fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
        }}>
          Waiting for Selection
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2, md: 3 },
          width: '100%'
        }}>
          {waitingEvents.map((event) => (
            <Box key={event.id}>
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
      </Box>
    </Box>
  );
};

export default CoordinatorDashboard;