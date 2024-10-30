// src/components/DonorSelectionTable.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridCellEditCommitParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface Donor {
  id: number;
  name: string;
  total_donations: number;
  communication_preference: string;
  location: string;
  notes: string;
}

const initialDonors: Donor[] = [
  { id: 1, name: 'Amy', total_donations: 5000, communication_preference: 'Event', location: 'VANCOUVER', notes: 'more info' },
  { id: 2, name: 'John', total_donations: 3000, communication_preference: 'Survey', location: 'WHITEROCK', notes: 'more info' },
  { id: 3, name: 'Sam', total_donations: 2000, communication_preference: 'Email', location: 'BURNABY', notes: 'more info' },
  { id: 4, name: 'Tom', total_donations: 1000, communication_preference: 'Event', location: 'SURREY', notes: 'more info' },
  { id: 5, name: 'Lily', total_donations: 500, communication_preference: 'Survey', location: 'RICHMOND', notes: 'more info' },
];

const DonorSelectionTable: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const navigate = useNavigate();

  const handleEditCommit = (params: GridCellEditCommitParams) => {
    const updatedDonors = donors.map(donor =>
      donor.id === params.id ? { ...donor, [params.field]: params.value } : donor
    );
    setDonors(updatedDonors);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Donor Name', width: 150 },
    { field: 'total_donations', headerName: 'Total Donations', width: 180, type: 'number' },
    { field: 'communication_preference', headerName: 'Communication Preference', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/donor/${params.row.id}`);
          }}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {params.value}
        </a>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2, backgroundColor: 'white', position: 'relative' }}>
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
          onCellEditCommit={handleEditCommit}
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: '15px',
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
