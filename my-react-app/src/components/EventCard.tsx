import React from "react";
import utc from 'dayjs/plugin/utc';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import styled from '@mui/material/styles/styled';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useParams } from 'react-router-dom';


const events = [
  { id: 1, date: "4 Feb 2025", title: "Thanks Giving Party", details: "Thanksgiving celebration " },
  { id: 2, date: "4 Feb 2025", title: "Conference in Cancer", details: "A conference discussing the latest in cancer research." },
  { id: 3, date: "4 Feb 2025", title: "Studio", details: "An open studio event showcasing local artists." },
];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
      borderColor: 'black',
    }),
  }));

const EventCard: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL
  const event = events.find(event => event.id.toString() === id); // Find the event by ID

  if (!event) {
    return <Typography variant="h6">Event not found</Typography>; }// Handle case where event is not found
  
    return (
        <Box>
          <Typography variant="h5">EVENTS / {event.title}</Typography>
          <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            
            <Grid container spacing={4} columns={24} direction="row" alignItems="center">
              
            <Typography>Name</Typography>
            <br />
              <Grid item xs={8} sx={{ border: '2px solid black', height: '30px'}}>
                <Typography>{event.title}</Typography>
              </Grid>
              
              
              <Grid item xs={8} sx={{ border: '2px solid black', 
                                      height: '30px', display: 'flex', 
                                      justifyContent: 'center', 
                                      alignItems: 'center',
                                      }}>
                <Typography>{event.date}</Typography>
              </Grid>
              
              
              <Grid item xs={8} sx={{ border: '2px solid black', height: '30px'}}>
                <Typography>{event.details}</Typography>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
      );}
   

export default EventCard;

