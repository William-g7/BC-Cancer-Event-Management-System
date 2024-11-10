// src/components/DonorSelectionTable.tsx
import React, { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { DonorService } from '../services/donorService.ts';
import { useParams } from 'react-router-dom';
import { EventService } from '../services/eventService.ts';
import { useEventAndDonors } from '../hooks/useDonors.ts';
import { EventData } from '../types/event';

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
    return { event: eventData as EventData, donors: donorsData };
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
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">
          {data?.event ? `EVENTS / ${data.event.name}` : 'Loading...'}
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={data?.donors || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default DonorSelectionTable;
