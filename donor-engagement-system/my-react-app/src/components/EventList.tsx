import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';
import { useNavigate } from 'react-router-dom';

const eventService = new EventService();

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const fetchEvents = React.useCallback(() => {
    console.log('fetchEvents called');
    return eventService.getEvents();
  }, []);
  
  const { events, loading, error } = useEvents(fetchEvents);
  
  const handleEventClick = (id: number) => {
    navigate(`/event/${id}`);
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none',
          width: '100%',
          overflowX: 'auto'
        }}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                Event Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                Organizer
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                Start Time
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                End Time
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                Location
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
              .map((event) => (
                <TableRow 
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.organizer?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(event.start_time).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(event.end_time).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EventList;
