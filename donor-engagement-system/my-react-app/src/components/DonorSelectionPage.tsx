import React, { useEffect, useState } from 'react';
import DonorSelectionTable from './DonorSelectionTable.tsx';
import OtherSelectionsTable from './OtherSelectionsTable.tsx';
import Sidebar from './Sidebar.tsx';
import { Box } from '@mui/system';
import Header from './Header.tsx';
import { useParams } from 'react-router-dom';
import { DonorService } from '../services/donorService.ts';
import { Button, useTheme, Snackbar, Alert} from '@mui/material';

const donorService = new DonorService();

const DonorSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);
  const [otherSelections, setOtherSelections] = useState<any[]>([]);
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [refreshTrigger] = useState(0);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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

  // Calculate confirmed donors count from other fundraisers
  const confirmedOtherDonorsCount = otherSelections.filter(donor => donor.state === 'confirmed').length;

  const refreshData = () => {
    if (!id) return;
    try {
      // Refresh the whole page
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Effect to check if there are confirmed donors and set isChangeMode accordingly
  useEffect(() => {
    const checkConfirmedDonors = async () => {
      if (!id) {
        console.error('No event ID provided');
        return;
      }
      const allDonors = await donorService.getDonorsByEvent(parseInt(id));
      const hasConfirmedDonors = allDonors.some(donor => donor.state === 'confirmed');
      setIsChangeMode(hasConfirmedDonors);
    };

    const checkSelectedDonors = async () => {
      if (!id) {
        console.error('No event ID provided');
        return;
      }
      const allDonors = await donorService.getDonorsByEvent(parseInt(id));
      setSelectedDonors(allDonors
        .filter(donor => donor.state === 'selected')
        .map(donor => donor.id)
      );
    };

    if (id) {
      checkConfirmedDonors();
      checkSelectedDonors();
    }
  }, [id]); // Run this effect when selectedDonors or id changes

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveSelection = async () => {
    try {
      if (!id) return;

      // Get all donors for the event
      const allDonors = await donorService.getDonorsByEvent(parseInt(id));
      console.log('Donors data received in frontend:', allDonors);

      // Get the IDs of all unselected donors
      const unselectedDonors = allDonors
        .filter(donor => !selectedDonors.includes(donor.id))
        .map(donor => donor.id);

      // Save the selected donors and unselect the unselected donors to the database
      await Promise.all([
        donorService.saveSelections(parseInt(id), selectedDonors),
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
        setSnackbar({
            open: true,
            message: 'Loading...',
            severity: 'success'
        });

        // Fetch all donors to get the confirmed ones
        const allDonors = await donorService.getDonorsByEventFundraiser(parseInt(id));
        
        // Get the IDs of all confirmed donors
        const confirmedDonorIds = allDonors
            .filter(donor => donor.state === 'confirmed')
            .map(donor => donor.id);

        // Update selectedDonors to include confirmed donors
        setSelectedDonors(confirmedDonorIds);
        
        // Update the database to confirm the selections
        await donorService.saveSelections(parseInt(id), confirmedDonorIds);
        
        setIsChangeMode(false); // Reset change mode after selection

        setTimeout(async () => {
            await refreshData();
            console.log('Data refreshed after change');
            setSnackbar({
                open: true,
                message: 'Confirmed donors have been selected.',
                severity: 'success'
            });
        }, 1000);
        
    } catch (error) {
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
      const allDonors = await donorService.getDonorsByEvent(parseInt(id));

      // Get the IDs of all unselected donors
      const unselectedDonors = allDonors
        .filter(donor => !selectedDonors.includes(donor.id))
        .map(donor => donor.id);

      // Save the selected donors and unselect the unselected donors to the database
      await Promise.all([
        donorService.confirmSelections(parseInt(id), selectedDonors),
        donorService.unselectDonors(parseInt(id), unselectedDonors)
      ]);

      
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
      <Box sx={{ width: { xs: '60px', lg: '200px', flexShrink: 0 } }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            position: 'relative',
            marginLeft: { xs: '10px', sm: '20px', md: '40px' },
          }}>
        {/* Header */}
        <Box sx={{ 
          position: 'absolute', 
          right: 40,
        }}>
          <Header />
        </Box>

        {/* Content */}
        <Box sx={{ mt: 16 }}>
          <DonorSelectionTable 
            onSelectionChange={setSelectedDonors}
            selectedDonors={selectedDonors}
            refreshTrigger={refreshTrigger}
            confirmedOtherDonorsCount={confirmedOtherDonorsCount}
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
            {!isChangeMode && (<Button 
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
            </Button>)}
            <Button 
              variant="contained"
              onClick={isChangeMode ? handleChangeSelection : handleConfirmSelection}
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
              {isChangeMode ? 'Change Selection' : 'Confirm Selection'}
            </Button>
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