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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
    if (role === 'Fundraiser') {
      navigate(`/event/${id}/selections`);
    } else {
      navigate(`/event/${id}/selections/review`);
    }
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

  const [openNotification, setOpenNotification] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState<any>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenNotification = (fundraiser: any) => {
    setSelectedFundraiser(fundraiser);
    setNotificationMessage(`Please finish the donor selection for ${event.name}`);
    setOpenNotification(true);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
    setNotificationMessage('');
  };

  const handleSendNotification = async () => {
    try {
      // Add your notification sending logic here
      // await eventService.sendNotification(selectedFundraiser.id, notificationMessage);
      handleCloseNotification();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
          <Grid item xs={3} sx={{ mt: 4 }}>
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
                  justifyContent: 'space-between',
                  '& > :last-child': {
                    marginLeft: 'auto',
                    paddingLeft: 2
                  }
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <MailOutlineIcon 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          cursor: 'pointer',
                          fontSize: 20
                        }} 
                        onClick={() => handleOpenNotification(fundraiser)}
                      />
                    </Box>
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
      <Dialog 
        open={openNotification} 
        onClose={handleCloseNotification} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            '& .MuiDialogTitle-root': {
              backgroundColor: theme.palette.primary.main,
              color: 'white'
            }
          }
        }}
      >
        <DialogTitle>Send Notification to {selectedFundraiser?.name}</DialogTitle>
        <DialogContent sx={{ mt: 5, mb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            defaultValue={`Please finish the donor selection for ${event.name}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotification} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained" 
            sx={{ 
              backgroundColor: theme.palette.green.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventDetail;