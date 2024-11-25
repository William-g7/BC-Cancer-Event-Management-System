import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { theme } from "../theme/theme.ts";

const Header: React.FC = () => {
  const username = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role') || 'User';
  

  return (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "flex-end",
        width: '1200px',
        height: "88px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "white",
        zIndex: 1100,
        marginRight: '-30px'
      }}>
        <Avatar alt={username} src="/static/images/avatar.png" />
        <Box sx={{ display: "flex", flexDirection: "column", marginRight: '0px' }}>
            <Typography variant="body1" sx={{ marginLeft: 2, color: theme.palette.primary.main }}>
                {username}
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2, color: theme.palette.darkGrey.main }}>
               {role} 
            </Typography>
        </Box>
      </Box>
  );
};

export default Header;
