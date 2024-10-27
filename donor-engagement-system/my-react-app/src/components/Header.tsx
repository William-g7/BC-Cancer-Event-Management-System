import React from "react";
import { Box, Typography, Avatar } from "@mui/material";


const Header: React.FC = () => {
  return (
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginLeft: "auto" }}>
        <Avatar alt="Amy Brown" src="/static/images/avatar.png" />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" sx={{ marginLeft: 2, color: "black" }}>
                Amy Brown
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2, color: "grey" }}>
                Fundraiser
            </Typography>
        </Box>
      </Box>
  );
};

export default Header;
