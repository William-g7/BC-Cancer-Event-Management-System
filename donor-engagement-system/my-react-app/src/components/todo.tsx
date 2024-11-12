import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import React, { useCallback } from "react";
import { EventService } from '../services/eventService.ts';
import { useEvents } from '../hooks/useEvents.ts';


const Todo: React.FC = () => {
  const eventService = new EventService();
const todoList = [
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
];
const fetchEvents = useCallback(() => eventService.getDashboardEvents(), []);

const { events, loading, error } = useEvents(fetchEvents);
console.log(events);
  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">To Do List</Typography>
        <List>
          {events.map((todo, index) => (
            <ListItem key={index}>
              <Typography variant="body2">Select Donors for {todo.name} Due: {new Date(todo.start_time).toLocaleDateString()}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Todo;
