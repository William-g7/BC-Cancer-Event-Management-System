import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const notifications = [
  "Thanks Giving Party Selection should be finished in 2 days!",
  "Thanks Giving Party Selection should be finished in 2 days!",
  "Thanks Giving Party Selection should be finished in 2 days!",
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
