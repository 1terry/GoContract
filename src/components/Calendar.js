import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { useAuth } from '../context/AuthContext';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ userId:'', date: '', title: '' });
  const [bookings, setBooking] = useState([])
  const { userData } = useAuth();

  useEffect(() => {
    // Fetch events from your database
    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const fetchEvents = async () => {
    try {
      newEvent.userId = userData.userId
      newEvent.userId = "194084ad-7581-4e4e-9bc6-c5214d53eb4d"
      const response = await fetch(`http://localhost:3001/events/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      setEvents(data);

      if (userData.userType === "contractor") {
        const bookingResponse = await fetch(`http://localhost:3001/bookings/contractorsearch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });
        const Bookingdata = await bookingResponse.json();
        setBooking(Bookingdata);
        console.log(Bookingdata.date.split('T')[0]);
      } else {
        const bookingResponse = await fetch(`http://localhost:3001/bookings/clientsearch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });
        const Bookingdata = await bookingResponse.json();
        setBooking(Bookingdata);
      }
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
      newEvent.userId = userData.userId
      newEvent.userId = "194084ad-7581-4e4e-9bc6-c5214d53eb4d"
      const response = await fetch(`http://localhost:3001/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        fetchEvents(); // Refresh events after adding a new one
        setNewEvent({userId:'', date: '', title: '' });
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
      const combinedArray = [...dateEvents, ...bookings.filter((book) => book.date.split('T')[0] === dateKey && book.status)];
      if (combinedArray.length > 0) {
        const firstEvent = combinedArray[0]; // Display only the first event
        if (dateEvents < 1){
          return (
            <div className="event-marker">
              <div className="event">{firstEvent.typeOfService}</div>
            </div>
          );
        } else {
          return (
            <div className="event-marker">
              <div className="event">{firstEvent.title}</div>
            </div>
          );
        }
      }
    }
    return null;
  };
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDateEvents = events.filter((event) => event.date === selectedDateKey);
  const selectedDateBookings = bookings.filter((book) => book.date.split('T')[0] === selectedDateKey && book.status)

  
  return (
    <div>
          <h2>Calendar</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
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
            <h3>Events and Bookings on {selectedDate.toDateString()}</h3>
            {(selectedDateEvents.length > 0 || selectedDateBookings.length > 0) && (
              <ul>
                {selectedDateEvents.map((event, index) => (
                  <li key={index}>{`${event.date} - Event: ${event.title}`}</li>
                ))}
                {selectedDateBookings.map((book, index) => (
                  <li key={index}>{`${book.date.split('T')[0]} - Booking Service: ${book.typeOfService} - Descrtipion: ${book.serviceDetails}`}</li>
                ))}
              </ul>
            )}
            {!(selectedDateEvents.length > 0 || selectedDateBookings.length > 0) && (
              <p>No events or bookings on the selected date.</p>
            )}
    </div>
  );
};

export default CalendarComponent;