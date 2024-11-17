import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const columns: GridColDef[] = [
    { field: 'full_name', headerName: 'Name', width: 150 },
    { field: 'last_gift_appeal', headerName: 'Last Appeal', width: 180 },
    { field: 'last_gift_date', headerName: 'Last Donation Date', width: 180 },
    { field: 'total_donations', headerName: 'Total Donations', width: 180 },
    { field: 'fundraiser_name', headerName: 'Selected By', width: 150 },
    { field: 'state', headerName: 'Status', width: 120 },
];

interface OtherSelectionsTableProps {
    donors: any[];
}

const OtherSelectionsTable: React.FC<OtherSelectionsTableProps> = ({ donors }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        console.log('Other selections donors:', donors);
    }, [donors]);

    // Format the data before returning
    const formattedDonors = donors.map(donor => ({
        ...donor,
        total_donations: donor.total_donations ? `$${Number(donor.total_donations).toLocaleString()}` : '-',
        last_gift_date: donor.last_gift_date 
          ? new Date(donor.last_gift_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : '-',
        full_name: `${donor.first_name} ${donor.last_name}`
      }));
  

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Donors selected by other fundraisers ({donors.length})
                </Typography>
                <IconButton 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    size="small"
                    sx={{ ml: 1 }}
                >
                    {isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
            </Box>
            
            <Collapse in={!isCollapsed} timeout={300}>
                <DataGrid
                    rows={formattedDonors}
                    columns={columns}
                    autoHeight
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </Collapse>
        </Box>
    );
};

export default OtherSelectionsTable;