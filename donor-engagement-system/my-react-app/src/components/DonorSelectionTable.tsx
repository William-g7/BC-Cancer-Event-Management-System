import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridCellEditCommitParams } from '@mui/x-data-grid';


interface Donor {
  id: number;
  name: string;
  largestGiftAppeal: number;
  lastGiftDate: string;
  address: string;
  notes: string;
}

const initialDonors: Donor[] = [
  { id: 1, name: 'Amy', largestGiftAppeal: 5000, lastGiftDate: '2024-01-15', address: '123 Main St', notes: 'This donor is great!' },
  { id: 2, name: 'John', largestGiftAppeal: 3000, lastGiftDate: '2024-02-20', address: '456 Elm St', notes: '' },
  // Add more initial data as needed
];

const DonorSelectionTable: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  

  const handleEditCommit = (params: GridCellEditCommitParams) => {
    const updatedDonors = donors.map(donor =>
      donor.id === params.id ? { ...donor, [params.field]: params.value } : donor
    );
    setDonors(updatedDonors);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Donor Name', width: 150 },
    { field: 'largestGiftAppeal', headerName: 'Largest Gift Appeal', width: 180, type: 'number' },
    { field: 'lastGiftDate', headerName: 'Last Gift Date', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 200, editable: true },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2, backgroundColor: 'white', position: 'relative'}}>
      <Typography variant="h4" fontWeight="bold">
        EVENTS / Conference in Cancer
      </Typography>
      <Typography variant="subtitle2" color="black" fontSize={20}>Total Invitation: 100 </Typography>
      <Typography variant="subtitle2" color="black" fontSize={20}>Total Selected: 10 </Typography>
      

    <Box sx={{ height: 500, width: 1200 }}>
      <DataGrid
        rows={donors}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: '15px', // Adjust the font size for cells
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: '17px',
            fontWeight: 'bold !important',
          },
        }}
      />
    </Box>

      <Box sx={{ position: 'absolute', marginTop: 80, marginLeft: 100 }}>
        <Button variant="contained" sx={{ width: '180px', height: '40px', backgroundColor: 'gray' }} onClick={() => console.log('Save Current')}>
          Save Current
        </Button>
        <Button variant="contained" sx={{ width: '200px', height: '40px', backgroundColor: 'gray', marginLeft: '20px' }} onClick={() => console.log('Confirm Selection')}>
          Confirm Selection
        </Button>
      </Box>
    </Box>
  );
};

export default DonorSelectionTable;