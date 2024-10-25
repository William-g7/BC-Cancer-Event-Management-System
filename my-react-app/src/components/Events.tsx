import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";

const events = [
  { id: 1, date: "4 Feb 2025", title: "Thanks Giving Party" },
  { id: 2, date: "4 Feb 2025", title: "Conference in Cancer" },
  { id: 3, date: "4 Feb 2025", title: "Studio" },
];

const Events: React.FC = () => {
  const navigate = useNavigate();


  const handleEventClick = (id: number) => {
    console.log("Event clicked", id);
    navigate(`/event/${id}`);
    
  };

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2, marginLeft: '0px'}}>
        Your Upcoming Events
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card onClick={() => handleEventClick(event.id)} 
                  sx={{ cursor: 'pointer' }}
                  style={{border: "none", boxShadow: "none"}}>
              <CardMedia
                component="img"
                height="200"
                image="/calendar.png"  
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {event.date}
                </Typography>
                <Typography sx={{fontSize: 16}}>{event.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2, marginLeft: '0px' }}>
        Waiting for donor selection
      </Typography>
      <Grid container spacing={2}>
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card onClick={() => handleEventClick(event.id)}
                  sx={{ cursor: 'pointer' }}
                  style={{border: "none", boxShadow: "none"}}>
              <CardMedia
                component="img"
                alt={event.title}
                height="200"
                image="/calendar.png"
              />
              <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {event.date}
                </Typography>
                <Typography sx={{ fontSize: 16}}>{event.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Events;



