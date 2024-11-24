// src/components/DonorNotePage.tsx
import React from 'react';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface Donor {
  id: number;
  name: string;
  notes: string[];
}

const initialDonors: Donor[] = [
  { id: 1, name: 'Amy', notes: ['This person is very kind-hearted.', 'Has a history of donating to health causes.', 'Christian.', 'Loves attending charity events.'] },
  { id: 2, name: 'John', notes: ['Passionate about environmental causes.', 'Battling a chronic illness.', 'Loves nature and the outdoors.', 'Prefers communication via email.'] },
  { id: 3, name: 'Sam', notes: ['Active volunteer in the community.', 'Recently converted to Christianity.', 'Enjoys art and cultural events.', 'Has a large social circle.'] },
  { id: 4, name: 'Tom', notes: ['Interested in animal welfare.', 'Prefers minimal interaction.', 'Regularly attends church.', 'Recently retired and moved to the city.'] },
  { id: 5, name: 'Lily', notes: ['Young professional and very energetic.', 'Loves fitness and wellness activities.', 'Interested in educational causes.', 'Prefers receiving updates via text.'] },
];

const DonorNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const donor = initialDonors.find(d => d.id === Number(id));

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: { xs: '60px', sm: '200px' }, // Sidebar width
        }}
      >
        <Sidebar />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header aligned to the top-right */}
        <Box
          sx={{
            justifyContent: 'flex-end',
            display: 'flex',
            position: 'fixed',
            top: 20,
            right: 0,
            marginRight: '15px',
          }}
        >
          <Header />
        </Box>

        {/* Main content area with some spacing */}
        <Box sx={{ marginTop: '80px', marginLeft: '30px' }}>
          {donor ? (
            <>
              <Typography variant="h4" gutterBottom>
                Donor Details
              </Typography>
              <Typography variant="h6">
                <strong>Name:</strong> {donor.name}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: '20px' }}>
                Notes:
              </Typography>
              <List>
                {donor.notes.map((note, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={note} />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="h6" color="error">
              Donor not found.
            </Typography>
          )}
        </Box>

        {/* Return to previous page button at the bottom-right */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: '180px', height: '40px', backgroundColor: 'gray' }}
            onClick={() => navigate(-1)} // Return to the previous page
          >
            Return to Selection
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DonorNotePage;
