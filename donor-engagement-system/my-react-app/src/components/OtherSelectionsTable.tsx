import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'fundraiser_name', headerName: 'Selected By', width: 150 },
    { field: 'state', headerName: 'Status', width: 120 },
];

interface OtherSelectionsTableProps {
    donors: any[];
}

const OtherSelectionsTable: React.FC<OtherSelectionsTableProps> = ({ donors }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                DONORS SELECTED BY OTHER FUNDRAISERS
            </Typography>
            <DataGrid
                rows={donors}
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
        </Box>
    );
};

export default OtherSelectionsTable;