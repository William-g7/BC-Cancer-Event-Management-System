import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const todoList = [
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
  "Select Donors for Thanks Giving Party Due: 11/12/2024",
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
