import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const notifications = [
  "Celine: Can you please select 2 more donors (in total 24) for the Charity Night?",
  "Tom: Please confirm your selection for the Bowie Ball by Friday.",
];

const Notifications: React.FC = () => {
  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">Notifications</Typography>
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{notification}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Notifications;
