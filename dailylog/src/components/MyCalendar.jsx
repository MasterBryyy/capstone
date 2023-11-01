import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Confirmation from './Confirmation';
import './MyCalendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isEventFormOpen, setEventFormOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    time: '',
    start: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationCallback, setConfirmationCallback] = useState(null);

  // Function to show the confirmation dialog
  const showDeleteConfirmation = (event) => {
    setConfirmationMessage(`Are you sure you want to delete "${event.title}"?`);
    setConfirmationCallback(() => handleEventDelete(event));
    setShowConfirmation(true);
  };

  // Function to handle confirmation
  const handleConfirmation = () => {
    if (confirmationCallback) {
      confirmationCallback();
    }
    setShowConfirmation(false);
  };

  // Function to handle cancellation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const formatEvent = (event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  });

  const handleSelect = ({ start }) => {
    setEventFormOpen(true);
    setEventForm({
      title: '',
      time: '',
      start,
    });
  };

  const handleEventDelete = (event) => {
    setConfirmationMessage(`Are you sure you want to delete "${event.title}"?`);
    setConfirmationCallback(() => {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    });
    setShowConfirmation(true);
  };

  const handleEventFormSubmit = () => {
    const { title, time, start } = eventForm;
    if (title && time && start) {
      const startWithTime = moment(start).set({
        hour: parseInt(time.split(':')[0], 10),
        minute: parseInt(time.split(':')[1], 10),
      });
      const endWithTime = moment(startWithTime).add(1, 'hour');

      const newEvent = formatEvent({
        id: events.length + 1, // Assuming you have a unique ID for each event
        start: startWithTime,
        end: endWithTime,
        title,
      });

      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setEventFormOpen(false);
    }
  };

  const handleEventFormCancel = () => {
    setEventFormOpen(false);
  };

  const EventForm = (
    <div className="event-form">
      <input
        type="text"
        placeholder="Event name"
        value={eventForm.title}
        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
      />
      <input
        type="time"
        value={eventForm.time}
        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
      />
      <button onClick={handleEventFormSubmit}>Save</button>
      <button onClick={handleEventFormCancel}>Cancel</button>
    </div>
  );

  const handleEventClick = (event, e) => {
    // Prevent the default action (prevents the calendar from selecting the event)
    e.preventDefault();
    // Add your custom logic here for handling the event click
    // For now, just log the event details
    console.log('Event clicked:', event);
  };

  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <button className="delete-button" onClick={() => handleEventDelete(event)}>
      Delete
    </button>
  </div>
  );

  return (
    <div style={{ height: '700px' }}>
      <Calendar className='calcal'
        localizer={localizer}
        events={events.map(formatEvent)}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick}
        components={{
          event: EventComponent,
        }}
      />
      {isEventFormOpen && EventForm}
      {showConfirmation && (
        <Confirmation
          message={confirmationMessage}
          onConfirm={handleConfirmation}
          onCancel={handleCancelConfirmation}
        />
      )}
    </div>
  );
};

export default MyCalendar;
