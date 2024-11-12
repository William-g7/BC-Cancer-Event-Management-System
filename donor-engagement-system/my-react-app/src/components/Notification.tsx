import React, { useCallback } from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { useEvents } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';

const notifications = [
  "Thanks Giving Party Selection should be finished in 2 days!",
  "Thanks Giving Party Selection should be finished in 2 days!",
  "Thanks Giving Party Selection should be finished in 2 days!",
];

const Notifications: React.FC = () => {
  const eventService = new EventService();
  const fetchEvents = useCallback(() => eventService.getDashboardEvents(), []);

const { events, loading, error } = useEvents(fetchEvents);
const currentTime=(times)=>{
  const currentTime = new Date();
  const time=new Date(times);
  const diff = time.getTime() - currentTime.getTime();
return Math.floor((diff/(1000*60*60*24)));  
}
  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">Notifications</Typography>
        <List>
          {events.map((notification, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{notification.name} Selection should be finished in {currentTime(notification.end_time)} days!</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Notifications;
