import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const todoListFundraiser = [
  "Select Donors for Movember Stache Bash: 12/12/2024",
  "Select Donors for Bowie Ball: 05/01/2025",
  "Select Donors for The Cypress Challenge: 15/07/2025",
];

const todoListCoordinator = [
  "Charity Gala Donor Selection should be finished in 2 days!",
  "13th Annual Wetdashe Donor Selection should start in 3 days!",
  "Movember Stache Bash Donor Selection should start in next Friday!",
];


const Todo: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">To Do List</Typography>
        <List>
          {role === 'Fundraiser' && todoListFundraiser.map((todo, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{todo}</Typography>
            </ListItem>
          ))}
          {role === 'Coordinator' && todoListCoordinator.map((todo, index) => (
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
