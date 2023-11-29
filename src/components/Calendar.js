import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { v4 as uuid } from 'uuid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelect = (info) => {
    setSelectedDate(info);
    setOpen(true);
  };

  return (
    <div>
      <FullCalendar
        editable
        selectable
        events={events}
        select={handleSelect}
        headerToolbar={{
          start: "today prev next",
          end: "timeGridWeek",
        }}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the event name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Event Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setEventName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            if (eventName) {
              setEvents([
                ...events,
                {
                  title: eventName,
                  start: selectedDate.startStr,
                  end: selectedDate.endStr,
                  allDay: selectedDate.allDay,
                },
              ]);
            }
            setOpen(false);
          }}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyCalendar;
