import React from 'react';
import DonorSelectionTable from './DonorSelectionTable.tsx';
import Sidebar from './Sidebar.tsx';
import { Box } from '@mui/system';
import Header from './Header.tsx';

const DonorSelectionPage: React.FC = () => {
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
          <Box sx={{ mt: 16 }}>  {/* Added margin top to clear header */}
            <DonorSelectionTable />
          </Box>
        </Box>
      </Box>
    );
}

export default DonorSelectionPage;