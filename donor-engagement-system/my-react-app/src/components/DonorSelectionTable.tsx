// src/components/DonorSelectionTable.tsx
import React, {useCallback, useState} from 'react';
import { Box, Button, Typography,Drawer,TextField,IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { DonorService } from '../services/donorService.ts';
import { useParams } from 'react-router-dom';
import { EventService } from '../services/eventService.ts';
import { useEventAndDonors } from '../hooks/useDonors.ts';
import {DonorNotes, EventData} from '../types/event';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import "./DonorSelectionTable.css"
import {useEvents} from "../hooks/useEvents";
const donorService = new DonorService();
const eventService = new EventService();

const DonorSelectionTable: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  let [open,editopen]=useState(false)
  let [notes,editnotes]=useState<DonorNotes[]>([])
  let [lastgitDate,editLastgitDate]=useState({
    largest_gift: null,
    largest_gift_appeal:null,
    last_gift_amount:null
  })
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
  const toggleDrawer=(isBool:boolean,params)=>{
    editopen(isBool)
    let {largest_gift,largest_gift_appeal,last_gift_amount}=params.row
    console.log(largest_gift,largest_gift_appeal,last_gift_amount,params)
    editLastgitDate({largest_gift,largest_gift_appeal,last_gift_amount})
    eventService.getEventNote(params.id).then(r => {
      editnotes(r)
    })
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
        <p onClick={()=>toggleDrawer(true,params)}>...</p>
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
        <Drawer open={open}
                onClose={()=>editopen(false)}
                anchor={"right"}
        >
          <div className={"drawer"}>
            <p className={"drawer_title"}>CMMA SMITH</p>
            <div className={"drawer_top"}>
              <p className={"drawer_top_title"}>Lastgit Date:</p>
              <div className={"drawer_top_list"}>
                <span>{lastgitDate.largest_gift}</span>
                <span>{lastgitDate.largest_gift_appeal}</span>
                <span>{lastgitDate.last_gift_amount}</span>
              </div>
            </div>
            <div className={"drawer_center"}>
              <p className={"drawer_top_title"}>Notes</p>
              <div>
                {notes.map((note, index) => (
                    <div className={"drawer_select"}>
                      <span>{note.fundraiser_name}:</span>
                      <span>{note.note}</span>
                    </div>
                ))}

              </div>
            </div>
            <div className={"drawer_bottom"}>
              <TextField fullWidth id="outlined-basic" label="add you notes here" variant="outlined" />
              <IconButton color="primary" aria-label="add to shopping cart">
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </div>
          </div>
        </Drawer>
      </Box>
    </Box>
  );
};

export default DonorSelectionTable;
