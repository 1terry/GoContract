import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const Username = '1234'

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ username:'', date: '', title: '' });

  useEffect(() => {
    // Fetch events from your database
    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const fetchEvents = async () => {
    try {
      newEvent.username = Username
      const response = await fetch('http://localhost:3001/events/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Additional actions based on the selected date
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      newEvent.username = Username
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        fetchEvents(); // Refresh events after adding a new one
        setNewEvent({username:'', date: '', title: '' });
      } else {
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().split('T')[0];
      const dateEvents = events.filter((event) => event.date === dateKey);
  
      if (dateEvents.length > 0) {
        const firstEvent = dateEvents[0]; // Display only the first event
  
        return (
          <div className="event-marker">
            <div className="event">{firstEvent.title}</div>
          </div>
        );
      }
    }
    return null;
  };
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDateEvents = events.filter((event) => event.date === selectedDateKey);

  
  return (
    <div>
      <h2>Calendar Example</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
      <div>
        <h3>Add Event</h3>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
        />
        <br />
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
        />
        <br />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <div>
      <h3>Events on {selectedDate.toDateString()}</h3>
      {selectedDateEvents.length > 0 ? (
        <ul>
          {selectedDateEvents.map((event, index) => (
            <li key={index}>{`${event.date}: ${event.title}`}</li>
          ))}
        </ul>
      ) : (
        <p>No events on the selected date.</p>
      )}
    </div>
    </div>
  );
};

export default CalendarComponent;