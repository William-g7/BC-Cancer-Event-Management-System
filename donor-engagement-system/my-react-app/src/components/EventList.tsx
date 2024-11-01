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
  CircularProgress
} from '@mui/material';
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';

const eventService = new EventService();

const EventList: React.FC = () => {
  console.log('EventList component rendering');
  const fetchEvents = React.useCallback(() => {
    console.log('fetchEvents called');
    return eventService.getEvents();
  }, []);
  
  const { events, loading, error } = useEvents(fetchEvents);
  
  console.log('Current state:', { events, loading, error });

  if (loading) {
    console.log('Loading state');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  console.log('Rendering events:', events);
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Events
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Organizer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
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
