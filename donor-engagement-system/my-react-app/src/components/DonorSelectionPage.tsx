import React from 'react';
import DonorSelectionTable from './DonorSelectionTable.tsx';
import Sidebar from './Sidebar.tsx';
import { Box } from '@mui/system';
import Header from './Header.tsx';

const DonorSelectionPage: React.FC = () => {
    return (
      <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: 'white' }}>
        {/* Sidebar */}
        <Box sx={{ width: '250px' }}>
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
          <Box sx={{ mt: 16 }}>  {/* Added margin top to clear header */}
            <DonorSelectionTable />
          </Box>
        </Box>
      </Box>
    );
}

export default DonorSelectionPage;