import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState(new Array(7).fill(false));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      const eventsCol = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCol);
      const eventList = eventSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventList);
    };

    loadEvents();
  }, []);

  const handleSelect = (info) => {
    setStartTime(info.startStr.split('T')[1].slice(0, 5)); // Extract start time
    setEndTime(info.endStr.split('T')[1].slice(0, 5)); // Extract end time
    setOpen(true);
  };

  const handleDayOfWeekChange = (position) => {
    const updatedDaysOfWeek = daysOfWeek.map((item, index) =>
      index === position ? !item : item
    );
    setDaysOfWeek(updatedDaysOfWeek);
  };

  const createEvent = async () => {
    const selectedDays = daysOfWeek
      .map((selected, index) => (selected ? index.toString() : null))
      .filter((day) => day !== null);

    const newEvent = {
      title: eventName,
      daysOfWeek: selectedDays,
      startTime: startTime,
      endTime: endTime
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    setEvents([...events, { ...newEvent, id: docRef.id }]);
    setOpen(false);
  };

  return (
    <div>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable
        selectable
        events={events}
        select={handleSelect}
        headerToolbar={{
          start: "today prev next",
          end: "timeGridWeek",
        }}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the event name and set recurrence details.
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
          <div>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox checked={daysOfWeek[index]} onChange={() => handleDayOfWeekChange(index)} />}
                label={day}
              />
            ))}
          </div>
          <TextField
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            margin="normal"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createEvent}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyCalendar;

