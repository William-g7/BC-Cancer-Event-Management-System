import React, { useState } from 'react';
import { Box, Grid, Typography, Badge, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { EventService } from '../services/eventService.ts';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents.ts';
import { EventData } from '../types/event';
import { range } from '@mui/x-data-grid/internals';



const eventService = new EventService();

// Styling for each day box
const DayBox = styled(Box)(({ theme, isToday }) => ({
  border: '1px solid #ddd',
  height: '90px',
  position: 'relative',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));



const CalendarEvents: React.FC = () => {
  const fetchEvents = useCallback(() => eventService.getAllEvents(), []);
  const { events, loading, error } = useEvents(fetchEvents);

  // Function to get all events for a specific date
  const getEventsForDate = (date: string): Event[] => {
    return events.filter((event) => {
      // Extract just the date portion from the event's start_time (YYYY-MM-DD)
      const eventDateStr = new Date(event.start_time).toLocaleDateString('en-CA').split('T')[0];
      // Compare just the date strings
      return eventDateStr === date;
    });
  };

  const today = new Date().toLocaleDateString('en-CA').split('T')[0];

  // State to manage the current year and month displayed
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [currentMonth, setCurrentMonth] = useState<number>(10);  // November (0-indexed)

  // Update the current month and year for navigation
  const handleMonthChange = (direction) => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  // Get the number of days in the month and the starting weekday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  console.log(firstDay);    

  return (
    <Box sx={{ padding: 2, width: '100%', maxWidth: '1000px', position: 'fixed', marginRight: '35px'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => handleMonthChange('prev')}>
          <ArrowBackIosIcon />
        </IconButton>
        
        <Typography variant="h4" gutterBottom>
          {new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        
        <IconButton onClick={() => handleMonthChange('next')}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Day labels */}
      <Grid container>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography align="center">{day}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar days */}
      <Grid container>
        {/* Empty boxes for days before the first day of the month */}
        {[...Array(firstDay)].map((_, idx) => (
          <Grid item xs={12/7} key={`empty-${idx}`}>
            <DayBox />
          </Grid>
        ))}
        
        {/* Display days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
          const dayEvents = getEventsForDate(date);
          const isToday = date === today;

          
          return (
            <Grid item xs={12/7} key={date}>
              <DayBox 
                sx={{
                  backgroundColor: isToday ? '#f0f8ff' : 'inherit',  // Only today gets background color
                }}
              >
                <Typography 
                  variant="body1" 
                  color={isToday ? 'primary' : 'textSecondary'}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 8
                  }}
                  >
                  {i + 1}
                </Typography>
                {dayEvents.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    maxHeight: '60px',
                    overflow: 'auto',
                    marginTop: '30px'
                  }}>
                    {dayEvents.map((event, index) => (
                      <Badge
                        key={index}
                        color="secondary"
                        variant="dot"
                        sx={{ 
                          backgroundColor: '#FFE0E0',
                          borderRadius: '8px',
                          padding: '2px 6px',
                          width: '120px',  // Slightly smaller than parent to show padding
                          textAlign: 'mid-center' }}
                      >
                        <Typography 
                          variant="caption"  
                          sx={{ 
                            fontSize: '0.8rem',
                            maxWidth: '100%'
                          }}
                        >
                          {event.name}
                        </Typography>
                      </Badge>
                    ))}
                  </Box>
                )}
              </DayBox>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarEvents ;
