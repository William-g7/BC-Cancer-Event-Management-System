import React from 'react';
import DonorSelectionTable from './DonorSelectionTable.tsx';
import Sidebar from './Sidebar.tsx';
import { Box } from '@mui/system';
import Header from './Header.tsx';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DonorService } from '../services/donorService.ts';
import { Button, useTheme } from '@mui/material';


const donorService = new DonorService();

const DonorSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);
  const theme = useTheme();

  const handleSaveSelection = async () => {
      try {
          if (!id) return;
          console.log('Saving selections:', {
              eventId: id,
              selectedDonors,
          });
          await donorService.saveSelections(parseInt(id), selectedDonors);
          console.log('Save selections successful');
      } catch (error) {
          console.error('Error saving selections in page:', error);
      }
  };

  const handleConfirmSelection = async () => {
      try {
          if (!id) return;
          await donorService.confirmSelections(parseInt(id), selectedDonors);
      } catch (error) {
          console.error('Error confirming selections:', error);
      }
  };
  
    return (
      <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: 'white' }}>
        {/* Sidebar */}
        <Box sx={{ width: { xs: '60px', sm: '200px' } }}>
          <Sidebar />
        </Box>

        {/* Main content */}
        <Box sx={{ 
          flexGrow: 1, 
          marginLeft: '40px',
          marginRight: '30px',
          position: 'relative'
        }}>
          {/* Header */}
          <Box sx={{ 
            position: 'absolute', 
            right: 40,
            top: 0 
          }}>
            <Header />
          </Box>

          {/* Content */}
          <Box sx={{ mt: 16 }}>
            <DonorSelectionTable 
              onSelectionChange={setSelectedDonors}
              selectedDonors={selectedDonors}
            />
            
            {/* Buttons */}
            <Box sx={{ 
              position: 'fixed',
              bottom: 80,
              right: 40,
              display: 'flex',
              gap: 2,
              zIndex: 1100
            }}>
              <Button 
                variant="contained"
                onClick={handleSaveSelection}
                
                sx={{
                  backgroundColor: theme.palette.green.main,
                  color: 'white',
                  width: '210px',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                Save Selection
              </Button>
              <Button 
                variant="contained"
                onClick={handleConfirmSelection}
                
                sx={{
                  backgroundColor: theme.palette.green.main,
                  color: 'white',
                  width: '210px',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                Confirm Selection
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
}

export default DonorSelectionPage;