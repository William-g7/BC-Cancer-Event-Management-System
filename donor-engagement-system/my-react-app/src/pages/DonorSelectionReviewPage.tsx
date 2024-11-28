import React, { useEffect, useState } from 'react';
import ConfirmedSelectionsTable from '../components/ConfirmedSelectionsTable.tsx';
import Sidebar from '../components/Sidebar.tsx';
import { Box } from '@mui/system';
import Header from '../components/Header.tsx';
import { useParams } from 'react-router-dom'; 
import { DonorService } from '../services/donorService.ts';
import { useSingleEvent } from '../hooks/useEvents.ts';
import { EventService } from '../services/eventService.ts';
import { useCallback } from 'react';
import { Typography } from '@mui/material';

const donorService = new DonorService();
const eventService = new EventService();

// Review donor selections for an event
const DonorSelectionReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [confirmedSelections, setConfirmedSelections] = useState<any[]>([]);


    useEffect(() => {
        const fetchConfirmedSelections = async () => {
            if (!id) return;
            try {
                console.log('DonorSelectionReviewPage: Fetching confirmed donors for event ID:', id);
                const data = await donorService.getConfirmedDonorsByEvent(parseInt(id));
                setConfirmedSelections(data);
            } catch (error) {
                console.error('Error fetching confirmed donors:', error);
            }
        };
        fetchConfirmedSelections();
    }, [id]);

    const fetchEvent = useCallback(() => {
      if (!id) throw new Error('Event ID is required');
      return eventService.getEventById(parseInt(id));
    }, [id]);
  
    const { event } = useSingleEvent(fetchEvent);

    console.log('DonorSelectionReviewPage: Event:', event);

    return (
        <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: 'white' }}>
        {/* Sidebar */}
        <Box sx={{ width: { xs: '60px', lg: '200px', flexShrink: 0 } }}>
          <Sidebar />
        </Box>
  
        {/* Main content */}
        <Box sx={{ 
                    flexGrow: 1,
                    width: '100%',
                    overflow: 'auto',
                    position: 'relative',
                    marginLeft: { xs: '10px', sm: '20px', md: '40px' },
                    marginRight: { xs: '10px', sm: '20px', md: '20px' },
                }}>
              {/* Header */}
                <Header />
  
          {/* Content */}
          <Box sx={{ width: '100%', position: 'relative', mt: 16, marginTop: 5}}>
            <Box sx={{ mb: 4}}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {event ? `EVENTS / ${event.name}` : 'Loading...'}
              </Typography>
              <Typography variant="h6" color='#905AA6' sx={{ mb: 3 }}>
                Selected Donors : {confirmedSelections.length} /{event?.expected_selection}
              </Typography>
            </Box>
          
          <Box sx={{ mt: 4, marginRight: 2 }}>
            <ConfirmedSelectionsTable donors={confirmedSelections} />
          </Box>
        </Box>
      </Box>
    </Box>
    );
}

export default DonorSelectionReviewPage;