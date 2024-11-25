import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const feedback = [
  "Parvati Patel confirmed the donor selection for the Charity Gala.",
  "Hiroshi Nakamura confirmed the donor selection for the Bowie Ball.",
];

const Feedback: React.FC = () => {
  return (
    <Card style={{border: "none", boxShadow: "none"}}>
      <CardContent>
        <Typography variant="h6">Recent Feedback</Typography>
        <List>
          {feedback.map((message, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{message}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Feedback;