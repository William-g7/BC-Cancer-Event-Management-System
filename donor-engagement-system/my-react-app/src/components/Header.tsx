import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { theme } from "../theme/theme.ts";

const Header: React.FC = () => {
  const username = localStorage.getItem('username') || 'Guest';

  return (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "flex-end",
        marginLeft: {xs:"100px", lg:"270px"},
        marginRight: {xs:"10px", lg:"40px"},
        height: "88px",
        borderBottom: "1px solid #e0e0e0",
        position: "relative",
        right: 0,
        left: 0,
        top: 0,
        backgroundColor: "white",
        zIndex: 1100,



      }}>
        <Avatar alt={username} src="/static/images/avatar.png" />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" sx={{ marginLeft: 2, color: theme.palette.primary.main }}>
                {username}
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2, color: theme.palette.darkGrey.main }}>
                Fundraiser
            </Typography>
        </Box>
      </Box>
  );
};

export default Header;
