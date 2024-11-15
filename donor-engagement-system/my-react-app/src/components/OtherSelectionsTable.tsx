import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        console.log('Other selections donors:', donors);
    }, [donors]);

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
            </Collapse>
        </Box>
    );
};

export default OtherSelectionsTable;