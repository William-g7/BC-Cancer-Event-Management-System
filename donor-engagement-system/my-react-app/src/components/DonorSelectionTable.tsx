// src/components/DonorSelectionTable.tsx
import React, { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { DonorService } from '../services/donorService.ts';
import { useParams } from 'react-router-dom';
import { EventService } from '../services/eventService.ts';
import { useEventAndDonors } from '../hooks/useDonors.ts';
import { Event } from '../types/event.ts';

const donorService = new DonorService();
const eventService = new EventService();

const DonorSelectionTable: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchEventAndDonors = useCallback(async () => {
    if (!id) throw new Error('Event ID is required');
    const [eventData, donorsData] = await Promise.all([
      eventService.getEventById(parseInt(id)),
      donorService.getDonorsByEvent(parseInt(id))
    ]);
    return { event: eventData, donors: donorsData };
  }, [id]);

  const { data, loading, error } = useEventAndDonors(fetchEventAndDonors);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }

  const columns: GridColDef[] = [
    { field: 'last_name', headerName: 'Donor Last Name', width: 150 },
    { field: 'first_name', headerName: 'Donor First Name', width: 150 },
    { field: 'total_donations', headerName: 'Total Donations', width: 180, type: 'number' },
    { field: 'communication_preference', headerName: 'Communication Preference', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <Link
          to={`/donor/${params.row.id}`}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {params.value}
        </Link>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2, backgroundColor: 'white', position: 'relative' }}>
      <Typography variant="h4" fontWeight="bold">
        EVENTS / {data.event?.name}
      </Typography>
      <Typography variant="subtitle2" color="black" fontSize={20}>Total Invitation: 100 </Typography>
      <Typography variant="subtitle2" color="black" fontSize={20}>Total Selected: 10 </Typography>

      <Box sx={{ height: 500, width: 1400 }}>
        <DataGrid
          rows={data.donors}
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
