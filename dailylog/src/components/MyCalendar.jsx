
import React, { useState, useCallback, useEffect,useRef } from 'react';
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
    start: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const confirmationCallbackRef = useRef(null);
  
  useEffect(() => {
    // This effect will run after each render
    if (confirmationCallbackRef.current) {
      confirmationCallbackRef.current(); // Execute the callback
      confirmationCallbackRef.current = null; // Reset the ref to null after deletion
    }
  }, [confirmationCallbackRef]); // Run the effect when confirmationCallbackRef changes



  // Function to handle confirmation
  const handleConfirmation = useCallback(() => {
    console.log("Confirmation callback before:", confirmationCallbackRef.current);
    if (confirmationCallbackRef.current) {
      confirmationCallbackRef.current();
    }
    console.log("Confirmation callback after:", confirmationCallbackRef.current);
    setShowConfirmation(false);
  }, []);


  // Function to handle cancellation
  const handleCancelConfirmation = () => {
    confirmationCallbackRef.current = null; // Reset confirmationCallbackRef to null
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
    confirmationCallbackRef.current = () => {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    };
    setShowConfirmation(true);
  };
  

  const handleEventFormSubmit = () => {
    const { title, start, days } = eventForm;
    if (title && start && days) {
      const endWithTime = moment(start).add(days, 'days');
  
      const newEvent = formatEvent({
        id: events.length + 1,
        start: moment(start).toDate(),
        end: endWithTime.toDate(),
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
        type="number"
        placeholder="Number of days"
        value={eventForm.days}
        onChange={(e) => setEventForm({ ...eventForm, days: e.target.value })}
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

