import React, { useState, useEffect, useMemo } from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useLocation } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import { theme } from "../theme/theme.ts";
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("Home");

  const menuItems = useMemo(() => [
    { text: "Home", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Events", icon: <EventIcon />, path: "/events" },
    { text: "Calendar", icon: <CalendarTodayIcon />, path: "/calendar" },
    { text: "Message", icon: <ChatIcon />, path: "/message" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ], []);

  // Update selected item based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => item.path === currentPath);
    if (matchingItem) {
      setSelectedItem(matchingItem.text);
    }
  }, [location.pathname, menuItems]);

  const handleIconClick = (text: string, path: string) => {
    setSelectedItem(text);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: '250px',
        height: "100vh",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: '20px' }}>
          <img 
            src="/BCCF-Logo.png" 
            alt="BC Cancer Logo" 
            style={{ 
              height: '72px',
              width: '165px'
            }} 
          />
        </Box>
      </Box>

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isSelected = selectedItem === item.text;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleIconClick(item.text, item.path)}
                sx={{
                  py: 1.5,
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isSelected 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'white', 
                  minWidth: 40,
                  opacity: isSelected ? 1 : 0.7
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '16px',
                      fontWeight: isSelected ? 600 : 400,
                      opacity: isSelected ? 1 : 0.7,
                      letterSpacing: '0.2px'
                    } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
