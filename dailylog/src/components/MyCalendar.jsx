import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      const newEvent = {
        start,
        end,
        title,
      };

      // Update the events state with the new event
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  const handleEventDelete = (event) => {
    // Filter out the selected event and update the events state
    setEvents((prevEvents) => prevEvents.filter((e) => e !== event));
  };

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={event => handleEventDelete(event)}
      />
    </div>
  );
};

export default MyCalendar;
