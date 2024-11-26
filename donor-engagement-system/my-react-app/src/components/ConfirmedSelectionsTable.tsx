import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const columns: GridColDef[] = [
    { 
        field: 'contacted',
        headerName: 'Contacted', 
        width: 100,
        type: 'boolean',
        editable: true,
        renderCell: (params) => (
            <input
                type="checkbox"
                checked={params.value || false}
                onChange={(event) => {
                    params.api.setEditCellValue({
                        id: params.id,
                        field: 'contacted',
                        value: event.target.checked
                    }, event);
                }}
            />
        )
    },
    { field: 'fundraiser_name', headerName: 'Selected By', width: 150 },
    { field: 'full_name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'address_line1', headerName: 'Address', width: 240 },
    { field: 'communication_restrictions', headerName: 'Communication Restrictions', width: 240 },
    { field: 'email_restrictions', headerName: 'Email Restrictions', width: 200 }
];

interface ConfirmedSelectionsTableProps {
    donors: any[];
}

const ConfirmedSelectionsTable: React.FC<ConfirmedSelectionsTableProps> = ({ donors }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [contactedDonors, setContactedDonors] = useState<{[key: number]: boolean}>({});

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
        full_name: `${donor.first_name} ${donor.last_name}`,
        email: `${donor.first_name}@${donor.last_name}.com`,
        phone: '123-456-7890'
      }));
  

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Confirmed Donors
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
                    editMode="cell"
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    onCellEditCommit={(params) => {
                        if (params.field === 'contacted') {
                            setContactedDonors(prev => ({ ...prev, [params.id]: params.value as boolean }));
                        }
                    }}
                    pageSizeOptions={[10, 20]}
                />
            </Collapse>
        </Box>
    );
};

export default ConfirmedSelectionsTable;
