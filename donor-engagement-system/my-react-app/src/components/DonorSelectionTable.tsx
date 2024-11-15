import React, { useCallback, useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { DonorService } from '../services/donorService.ts';
import { useParams } from 'react-router-dom';
import { EventService } from '../services/eventService.ts';
import { useEventAndDonors } from '../hooks/useDonors.ts';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {DonorNotes, EventData} from '../types/event';
import "./DonorSelectionTable.css"

const donorService = new DonorService();
const eventService = new EventService();


interface DonorSelectionTableProps {
  selectedDonors: number[];  
  onSelectionChange: (selected: number[]) => void;  
  refreshTrigger: number;
}


const DonorSelectionTable: React.FC<DonorSelectionTableProps> = ({
  selectedDonors,
  onSelectionChange,
  refreshTrigger
}) => {
  const { id } = useParams<{ id: string }>();

  const [isCollapsed, setIsCollapsed] = useState(false);


  let [open,editopen]=useState(false)
  let [notes,editnotes]=useState<DonorNotes[]>([])
  let [lastgitDate,editLastgitDate]=useState({
    largest_gift: null,
    largest_gift_appeal:null,
    last_gift_amount:null,
    last_name:null,
    first_name:null,
  })

  const fetchEventAndDonors = useCallback(async () => {
    if (!id) throw new Error('Event ID is required');
    const [eventData, donorsData] = await Promise.all([
      eventService.getEventById(parseInt(id)),
      donorService.getDonorsByEventFundraiser(parseInt(id))
    ]);

    // Format the data before returning
    const formattedDonors = donorsData.map(donor => ({
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

    return { 
      event: eventData as EventData, 
      donors: formattedDonors 
    };
  }, [id]);

  const { data, loading, error } = useEventAndDonors(fetchEventAndDonors, refreshTrigger);

  console.log('Donors data in table component:', data?.donors);

  React.useEffect(() => {
    if (data?.donors) {
      const confirmedIds = data.donors
        .filter(donor => donor.state === 'confirmed')
        .map(donor => donor.id);
      onSelectionChange([...confirmedIds]);
    }
  }, [data?.donors, onSelectionChange]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }
  const toggleDrawer=(isBool:boolean,params)=>{
    editopen(isBool)
    let {largest_gift,largest_gift_appeal,last_gift_amount,first_name,last_name}=params.row
    editLastgitDate({largest_gift,largest_gift_appeal,last_gift_amount,first_name,last_name})
    eventService.getEventNote(params.id).then(r => {
      editnotes(r)
    })
  }
  const columns: GridColDef[] = [
    { field: 'full_name', headerName: 'Name', width: 120 },
    { 
      field: 'last_gift_appeal', 
      headerName: 'Last Appeal', 
      width: 150,
    },
    { 
      field: 'last_gift_date', 
      headerName: 'Last Donation Date', 
      width: 200,
    },
    { field: 'total_donations', headerName: 'Total Donations', width: 180 },
    { field: 'address_line1', headerName: 'Address', width: 200 },
    { field: 'city', headerName: 'Location', width: 200 },
    { field: 'communication_restrictions', headerName: 'Communication', width: 200 },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        if (!params?.value) return '';
        return (
          <Link to={`/donor/${params.row.id}`}>
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography color={
          params?.value === 'confirmed' ? 'success.main' :
          params?.value === 'selected' ? 'primary.main' :
          'text.secondary'
        }>
          {params?.value || ''}
        </Typography>
      )
    }
  ];


  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ mb: 4 }}>
        
        <Typography variant="h4" sx={{ mb: 4 }}>
          {data?.event ? `EVENTS / ${data.event.name}` : 'Loading...'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Your own donors
          </Typography>
          <IconButton 
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="small"
            sx={{ 
              ml: 1,
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={!isCollapsed} timeout={300}>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={data?.donors || []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            isRowSelectable={(params) => params.row.state !== 'confirmed'}
            onRowSelectionModelChange={(newSelection) => {
              const confirmedIds = data?.donors
                .filter(donor => donor.state === 'confirmed')
                .map(donor => donor.id);
              
              const unconfirmedSelection = newSelection.filter(id => {
                const row = data?.donors.find(donor => donor.id === id);
                return row && row.state !== 'confirmed';
              });
              
              onSelectionChange([...confirmedIds, ...unconfirmedSelection]);
            }}
            rowSelectionModel={selectedDonors}
            initialState={{
              pagination: {
                  paginationModel: { page: 0, pageSize: 10},
              },
            }}  
            getRowClassName={(params) => {
              if (params.row.state === 'confirmed') return 'confirmed-row';
              return '';
            }}
            sx={{
              '& .confirmed-row': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '& .MuiCheckbox-root': {
                  color: 'rgba(0, 0, 0, 0.38)',
                  '&.Mui-checked': {
                    color: 'success.main',
                  },
                  '&.Mui-disabled': {
                    color: 'success.main',
                    opacity: 1,
                  }
                }
              }
            }}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default DonorSelectionTable;
