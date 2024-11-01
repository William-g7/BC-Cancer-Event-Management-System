import React, { useCallback } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import styled from '@mui/material/styles/styled';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useSingleEvent } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';

const eventService = new EventService();

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const fetchEvent = useCallback(() => {
    if (!id) throw new Error('Event ID is required');
    return eventService.getEventById(parseInt(id));
  }, [id]);

  const { event, loading, error } = useSingleEvent(fetchEvent);

  const handleClick = () => {
    navigate(`/event/${id}/donor-selection`);
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return <Typography variant="h6">Event not found</Typography>;
  }

  return (
    <Box sx={{width: '80%', marginTop: '70px', marginRight: '20px' }}>
      <Grid container spacing={2}>
        <Grid item sx={{marginBottom: '20px', marginLeft: '-15px'}}>
          <Typography variant="h4" fontWeight="bold">EVENTS / {event.name}</Typography>
        </Grid>

        <Grid container spacing={45} sx={{marginBottom: '15px'}}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle2" color="black" fontSize={20}>Name</Typography>
            <Box sx={{ width: '300px', border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1" sx={{fontSize: 20}}>{event.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle2" color="black" fontSize={20} sx={{whiteSpace: 'nowrap'}}>Starting time</Typography>
            <Box sx={{ width: '300px', border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1" sx={{fontSize: 20}}>{new Date(event.start_time).toLocaleDateString()}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle2" color="black" fontSize={20} sx={{whiteSpace: 'nowrap'}}>End time</Typography>
            <Box sx={{ width: '300px', border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1" sx={{fontSize: 20}}>2024/10/14 22:00</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={45}>
          <Grid item xs={12} md={6} lg={4}>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle2" color="black" fontSize={20} sx={{whiteSpace: 'nowrap'}}>Location</Typography>
            <Box sx={{ width: '300px', border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1" sx={{fontSize: 20}}>488 Main Street, Vancouver</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle2" color="black" fontSize={20} sx={{whiteSpace: 'nowrap'}}>number of invitation</Typography>
            <Box sx={{width: '300px',border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1" sx={{fontSize: 20}}>100</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={45}>
          <Grid item lg={2}>
            <Typography variant="subtitle2" color="black" fontSize={20}>Description</Typography>
            <Box sx={{width: 1030, height: 150, border: '2px solid black', padding: '8px', borderRadius: '4px' }}>
              <Typography variant="body1">
                {event.description || 'No description'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{position: 'relative'}}>
        <Grid item sx={{marginTop: '60px', marginBottom: '30px', marginLeft: '-15px'}}>
          <Typography variant="h5" fontWeight="bold"  marginBottom={'20px'}>EVENT FUNDRAISERS</Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey' }}>A</Avatar>
                </ListItemAvatar>
                <ListItemText primary="Ann Smith" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey' }}>J</Avatar>
                </ListItemAvatar>
                <ListItemText primary="John Wood" />
              </ListItem>
            </List>
        </Grid>
         <Grid sx={{position: 'absolute', bottom: -20, right: -330}}>
          <Button onClick={handleClick} variant="contained" sx={{ width: '200px', height: '40px', backgroundColor: 'gray' }}>
            Start Selection
          </Button>
        </Grid>  
      </Grid>

    </Box>
  );
}

export default EventDetail;

