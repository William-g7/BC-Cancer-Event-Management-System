import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from "react-router-dom";


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Events", icon: <EventIcon /> },
    { text: "Calendar", icon: <CalendarTodayIcon /> },
    { text: "Chat", icon: <ChatIcon /> },
  ];

  // Correctly typed function for handling clicks
  const handleIconClick = (text: string) => {
    console.log(`${text} icon clicked`);
    switch (text) {
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Events":
        navigate("/events");
        break;
      case "Calendar":
        navigate("/calendar");
        break;
      case "Chat":
        navigate("/chat");
        break;
      default:
        console.log("Invalid icon clicked");
    }
  };

  return (
    <Box
      sx={{
        width: 100,
        height: "150vh",
        backgroundColor: "#212121",
        color: "white",
        marginTop: "-10px",
        marginLeft: "-10px",
        
      }}
    >

      <Typography variant="h6" sx={{textAlign: 'center', padding: 1, color:'white', marginBottom: '20px' }}>
        BC CANCER
      </Typography>

      <img src="cat.png" alt="BC Cancer Logo" style={{width: '100%', display: 'flex', borderRadius: '300%'}} />

      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton onClick={() => handleIconClick(item.text)} sx={{flexDirection: 'column', alignItems: 'center', textAlign: 'center'}} >
              <ListItemIcon sx= {{color: 'white', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{flexDirection: 'column', alignItems: 'center', textAlign: 'center'}} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
