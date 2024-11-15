import React from 'react';
import DonorSelectionTable from './DonorSelectionTable.tsx';
import OtherSelectionsTable from './OtherSelectionsTable.tsx';
import Sidebar from './Sidebar.tsx';
import { Box } from '@mui/system';
import Header from './Header.tsx';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DonorService } from '../services/donorService.ts';
import { Button, useTheme, Snackbar, Alert } from '@mui/material';


const donorService = new DonorService();

const DonorSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);
  const [otherSelections, setOtherSelections] = useState<any[]>([]);
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOtherSelections = async () => {
      if (!id) return;
      try {
        const data = await donorService.getOtherFundraisersSelections(parseInt(id));
        setOtherSelections(data);
      } catch (error) {
        console.error('Error fetching other selections:', error);
      }
    };

    fetchOtherSelections();
  }, [id]);

  const refreshData = async () => {
    if (!id) return;
    try {
      const donorsData = await donorService.getDonorsByEventFundraiser(parseInt(id));
      setSelectedDonors(donorsData
        .filter(donor => donor.state === 'selected' || donor.state === 'confirmed')
        .map(donor => donor.id)
      );
      const otherData = await donorService.getOtherFundraisersSelections(parseInt(id));
      setOtherSelections(otherData);
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveSelection = async () => {
    try {
      if (!id) return;
      

      const allDonors = await donorService.getDonorsByEventFundraiser(parseInt(id));
      console.log('Donors data received in frontend:', allDonors);

      const selectedUnconfirmedDonors = selectedDonors.filter(id => {
        const donor = allDonors.find(d => d.id === id);
        return donor && donor.state !== 'confirmed';
      });
      

      const unselectedDonors = allDonors
        .filter(donor => 
          !selectedDonors.includes(donor.id) && 
          donor.state !== 'confirmed'
        )
        .map(donor => donor.id);


      await Promise.all([
        donorService.saveSelections(parseInt(id), selectedUnconfirmedDonors),
        donorService.unselectDonors(parseInt(id), unselectedDonors)
      ]);
      
      setSnackbar({
        open: true,
        message: `Successfully updated donor selections`,
        severity: 'success'
      });

      setTimeout(async () => {
        await refreshData();
      }, 1000);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save selections',
        severity: 'error'
      });
      console.error('Error saving selections:', error);
    }
  };

  const handleChangeSelection = async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      setSnackbar({
        open: true,
        message: 'Loading...',
        severity: 'success'
      });

      const donorsToUnselect = selectedDonors;
      await donorService.unselectDonors(parseInt(id), donorsToUnselect);
      setIsChangeMode(false);
      setSelectedDonors([]);
      
      setTimeout(async () => {
        await refreshData();
        console.log('Data refreshed after change');
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: 'Loading...',
          severity: 'success'
        });
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to change selections',
        severity: 'error'
      });
      console.error('Error changing selections:', error);
    }
  };

  const handleConfirmSelection = async () => {
    try {
      if (!id) return;
      await donorService.confirmSelections(parseInt(id), selectedDonors);
      
      setIsChangeMode(true);
      setSnackbar({
        open: true,
        message: `Successfully confirmed ${selectedDonors.length} donor(s)`,
        severity: 'success'
      });

      setTimeout(async () => {
        await refreshData();
      }, 1000);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to confirm selections',
        severity: 'error'
      });
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
          position: 'relative'  // Changed from the nested box
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
              refreshTrigger={refreshTrigger}
            />
            
            <Box sx={{ mt: 4 }}>
              <OtherSelectionsTable donors={otherSelections} />
            </Box>

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
                onClick={isChangeMode ? handleChangeSelection : handleSaveSelection}
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
                {isChangeMode ? 'Change Selection' : 'Save Selection'}
              </Button>
              {!isChangeMode && (
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
              )}
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
}

export default DonorSelectionPage;