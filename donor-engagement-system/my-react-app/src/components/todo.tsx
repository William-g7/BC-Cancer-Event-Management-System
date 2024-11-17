import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const todoList = [
  "Select Donors for Movember Stache Bash: 12/12/2024",
  "Select Donors for Bowie Ball: 05/01/2025",
  "Select Donors for The Cypress Challenge: 15/07/2025",
];

const Todo: React.FC = () => {
  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">To Do List</Typography>
        <List>
          {todoList.map((todo, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{todo}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Todo;
