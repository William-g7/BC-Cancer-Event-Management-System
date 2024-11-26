import React, { useCallback, useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useSingleEvent } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';
import { theme } from '../theme/theme.ts';

const eventService = new EventService();

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const role = localStorage.getItem('role');
  
  const fetchEvent = useCallback(() => {
    if (!id) throw new Error('Event ID is required');
    return eventService.getEventById(parseInt(id));
  }, [id]);

  const { event, loading, error } = useSingleEvent(fetchEvent);

  const handleClick = () => {
    navigate(`/event/${id}/selections`);
  }

  const [fundraiserStatus, setFundraiserStatus] = useState<{
    [key: number]: 'confirmed' | 'in_progress'
  }>({});
  
  useEffect(() => {
    const fetchFundraiserStatus = async () => {
      if (role === 'Coordinator' && id) {
        try {
          const status = await eventService.getFundraiserStatus(parseInt(id));
          
          const statusMap: { [key: number]: 'confirmed' | 'in_progress' } = {};
          
          status.forEach(item => {
            statusMap[item.fundraiserId] = item.status as 'confirmed' | 'in_progress';
          });
          
          setFundraiserStatus(statusMap);
        } catch (error) {
          console.error('Error fetching fundraiser status:', error);
        }
      }
    };
  
    fetchFundraiserStatus();
  }, [id, role]);

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
    <Box sx={{ width: '100%', position: 'relative', pb: 10 }}>
      {/* Title section without button */}
      <Box sx={{ 
        mb: 4
      }}>
        <Typography variant="h4">EVENTS / {event.name}</Typography>
      </Box>

      {/* Form container */}
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          {/* First row */}
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>Name</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Typography>{event.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>Starting time</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Typography>{new Date(event.start_time).toLocaleDateString()}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>End time</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Typography>{new Date(event.end_time).toLocaleDateString()}</Typography>
            </Box>
          </Grid>

          {/* Second row */}
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>Location</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Typography>{event.location}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>Number of invitation</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Typography>{event.expected_selection}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ mb: 1 }}>Participant goal</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white',
              minHeight: '24px'
            }}>
              <Typography>{event.participant_goal}</Typography>
            </Box>
          </Grid>

          {/* Description field */}
          <Grid item xs={12}>
            <Typography sx={{ mb: 1 }}>Description</Typography>
            <Box sx={{ 
              p: 2,
              border: `1px solid ${theme.palette.grey[500]}`,
              borderRadius: 1,
              backgroundColor: 'white',
              minHeight: '100px'
            }}>
              <Typography>{event.description || 'No description'}</Typography>
            </Box>
          </Grid>

          {/* Fundraisers section */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
            {role === 'Coordinator' ? 'FUNDRAISERS STATUS' : 'EVENT FUNDRAISERS'}
              </Typography>
            <Box sx={{ 
              backgroundColor: 'white'
            }}>
              {event.assigned_fundraisers?.map((fundraiser, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'grey.500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2
                    }}>
                      {fundraiser.name ? fundraiser.name[0] : '?'}
                    </Box>
                    <Typography>
                      {fundraiser.name}
                    </Typography>
                  </Box>
                  {role === 'Coordinator' && (
                    <Typography 
                      sx={{ 
                        color: fundraiserStatus[fundraiser.id] === 'confirmed' 
                          ? theme.palette.green.main 
                          : theme.palette.warning.main,
                        fontWeight: 500
                      }}
                    >
                      {fundraiserStatus[fundraiser.id] === 'confirmed' ? 'Confirmed' : 'In Progress'}
                    </Typography>
                  )}
                </Box>
              ))}
              {(!event.assigned_fundraisers || event.assigned_fundraisers.length === 0) && (
                <Typography color="text.secondary">No fundraisers assigned</Typography>
              )}
            </Box>
          </Grid>

        </Grid>
      </Box>
      {/* Button at bottom of content */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mt: 4
      }}>
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.green.main,
            color: 'white',
            width: '210px',
            height: '40px',
            '&:hover': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
         {role === 'Coordinator' ? 'SEE RESULTS' : 'START SELECTION'}
        </Button>
      </Box>
    </Box>
  );
}

export default EventDetail;