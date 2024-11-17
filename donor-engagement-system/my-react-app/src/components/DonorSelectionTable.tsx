// src/components/DonorSelectionTable.tsx
import React, { useCallback, useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DonorService } from '../services/donorService.ts';
import { useParams } from 'react-router-dom';
import { EventService } from '../services/eventService.ts';
import { useEventAndDonors } from '../hooks/useDonors.ts';
import { EventData } from '../types/event';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Drawer } from '@mui/material';
import { theme } from '../theme/theme.ts';
const donorService = new DonorService();
const eventService = new EventService();


interface DonorSelectionTableProps {
  selectedDonors: number[];  
  onSelectionChange: (selected: number[]) => void;  
  refreshTrigger: number;
  confirmedOtherDonorsCount: number;
}


const DonorSelectionTable: React.FC<DonorSelectionTableProps> = ({
  selectedDonors,
  onSelectionChange,
  refreshTrigger,
  confirmedOtherDonorsCount,
}) => {
  const { id } = useParams<{ id: string }>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newNote, setNewNote] = useState<string>('');

  // Sidebar State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<any>(null);

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

  // Calculate the number of confirmed donors
  const confirmedDonorsCount = data?.donors?.filter(donor => donor.state === 'confirmed').length || 0;

  // Function to handle Sidebar toggle
  const handleDrawerOpen = async (params: GridRenderCellParams) => {
    const donorId = params.row.id; // Assuming the donor ID is in the row data
    const notes = await eventService.getEventNote(donorId); // Fetch notes for the selected donor
    setSidebarContent({ ...params.row, notes }); // Set the clicked row data and notes to Sidebar content
    setDrawerOpen(true); // Open Sidebar
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false); // Close Sidebar
    setSidebarContent(null); // Clear Sidebar content
  };

  const handleAddNote = async () => {
    if (newNote.trim() && sidebarContent) {
      const noteToAdd = {
        fundraiser_name: 'Parvati Patel',
        note: newNote,
      };
      sidebarContent.notes.push(noteToAdd);
      setNewNote('');
    }
  };

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

  const columns: GridColDef[] = [
    { field: 'full_name', headerName: 'Name', width: 120 },
    { 
      field: 'last_gift_appeal', 
      headerName: 'Last Appeal', 
      width: 120,
    },
    { 
      field: 'last_gift_date', 
      headerName: 'Last Donation Date', 
      width: 150,
    },
    { field: 'total_donations', headerName: 'Total Donations', width: 150 },
    { field: 'address_line1', headerName: 'Address', width: 200 },
    { field: 'city', headerName: 'Location', width: 200 },
    { field: 'communication_restrictions', headerName: 'Communication', width: 200 },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          onClick={() => handleDrawerOpen(params)}
          sx={{ width: "100%", height: "100%", cursor: "pointer" }}
        />
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 100,
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
        
        <Typography variant="h4" sx={{ mb: 1 }}>
          {data?.event ? `EVENTS / ${data.event.name}` : 'Loading...'}
        </Typography>
        <Typography variant="h6" color='#905AA6' sx={{ mb: 3 }}>
          Selected Donors : {confirmedDonorsCount + confirmedOtherDonorsCount} /{data?.event.expected_selection}
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
                  paginationModel: { page: 0, pageSize: 10 },
              },
            }}  
            pageSizeOptions={[5, 10, 20]}
            getRowClassName={(params) => {
              if (params.row.state === 'confirmed') return 'confirmed-row';
              return '';
            }}
            sx={{
              '& .confirmed-row': {
                backgroundColor: '#E5EEEF',
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

      {/* Sidebar Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{
            width: 400,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 3,
            boxSizing: "border-box",
            backgroundColor: '#f9f9f9',
            borderLeft: '1px solid #e0e0e0',
          }}
        >
          {/* Title and Main Info */}
          <Box>
            {sidebarContent && (
              <>
                <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  {sidebarContent.full_name}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {sidebarContent.notes.length > 0 ? (
                    sidebarContent.notes.map((note, index) => (
                      <div key={index}>
                        {note.fundraiser_name}: {note.note}
                      </div>
                    ))
                  ) : (
                    "No additional notes"
                  )}
                </Typography>
                {/* Input for new note */}
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 50 }}>
                  <textarea 
                    value={newNote} 
                    onChange={(e) => setNewNote(e.target.value)} 
                    placeholder="Add your notes here"
                    style={{
                      border: '1px solid #007BFF',
                      borderRadius: '4px',
                      padding: '10px',
                      resize: 'none',
                      height: '100px',
                      marginBottom: '8px',
                    }} 
                  />
                  <button 
                    onClick={handleAddNote} 
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DonorSelectionTable;
