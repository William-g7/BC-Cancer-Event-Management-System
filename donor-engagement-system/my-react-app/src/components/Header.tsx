import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Header: React.FC = () => {
  const username = localStorage.getItem('username') || 'Guest';

  return (
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginLeft: "auto" }}>
        <Avatar alt={username} src="/static/images/avatar.png" />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" sx={{ marginLeft: 2, color: "black" }}>
                {username}
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2, color: "grey" }}>
                Fundraiser
            </Typography>
        </Box>
      </Box>
  );
};

export default Header;
