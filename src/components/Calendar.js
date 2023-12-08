import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [services, setServices] = useState([]);
  const [newEvent, setNewEvent] = useState({ userId:'', date: '', title: '' });
  const [bookings, setBooking] = useState([])
  const { userData } = useAuth();

  useEffect(() => {
    // Fetch events from your database
    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const fetchEvents = async () => {
    try {
      setServiceName("Calendar")
      const service = await fetch(`http://localhost:3002/services`);
      const Data = await service.json();
      // Assuming data is an array, filter based on serviceName
      const ServiceData = Data.services.filter(service => service.serviceName == 'Calendar');
      if (!ServiceData || ServiceData.length === 0) {
        console.error('Service unavailable');
        setEvents([]); // Clear events if no service is available
        return;
      }
      setServices(ServiceData)
      newEvent.userId = userData.userId
      const response = await fetch(`${ServiceData[0].serviceURL}/events/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      setEvents(data);

      if (userData.userType === "contractor") {
        const bookingResponse = await fetch(`${ServiceData[0].serviceURL}/bookings/contractorsearch`, {
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
        const bookingResponse = await fetch(`${ServiceData[0].serviceURL}/bookings/clientsearch`, {
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
  const handleDelete = async (eventId) =>{
    try {
      const response = await fetch(`${services[0].serviceURL}/deleteEvent?eventId=${eventId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete trade');
      }

      // Update the state to remove the deleted trade
      setEvents(events => events.filter(events => events._id !== eventId));
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      newEvent.userId = userData.userId
      const response = await fetch(`${services[0].serviceURL}/events`, {
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
    try{
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
    } catch (error){
      console.error('Error filtering events by date:', error);
      return null;
    }
  };

// ...

// Helper function to filter events by date
  const filterEventsByDate = (events, dateKey) => {
    try {
      return events.filter((event) => new Date(event.date).toISOString().split('T')[0] === dateKey);
    } catch (error) {
      console.error('Error filtering events by date:', error);
      return [];
    }
  };

  // Helper function to filter bookings by date and status
  const filterBookingsByDate = (bookings, dateKey) => {
    try {
      return bookings.filter((book) => new Date(book.date).toISOString().split('T')[0] === dateKey && book.status);
    } catch (error) {
      console.error('Error filtering bookings by date and status:', error);
      return [];
    }
  };

  const selectedDateKey = new Date(selectedDate).toISOString().split('T')[0];
  const selectedDateEvents = filterEventsByDate(events, selectedDateKey);
  const selectedDateBookings = filterBookingsByDate(bookings, selectedDateKey);

  
  return (
    <div>
      {!services || services.length === 0? (
        <div>
          <h2>Service not available.</h2>
          <button onClick={() => navigate('/contractorDashboard')}>Back</button>
        </div>
        ) : (
          <>
          <h2>Calendar</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
            <h4>Add Event</h4>
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
            <button class="btn btn-primary" onClick={handleAddEvent}>Add Event</button>
            <h4>Events and Bookings on {selectedDate.toDateString()}</h4>
            {(selectedDateEvents.length > 0 || selectedDateBookings.length > 0) && (
              <ul>
                {selectedDateEvents.map((event, index) => (
                  <li key={index}>{`${event.date} - Event: ${event.title}`}
                  <br></br>
                  <button onClick={() => handleDelete(event._id)}>Delete</button></li>
                ))}
                {selectedDateBookings.map((book, index) => (
                  <li key={index}>{`${book.date.split('T')[0]} - Booking Service: ${book.typeOfService} - Descrtipion: ${book.serviceDetails}`}</li>
                ))}
              </ul>
            )}
            {!(selectedDateEvents.length > 0 || selectedDateBookings.length > 0) && (
              <p>No events or bookings on the selected date.</p>
            )}
            <button onClick={() => navigate('/contractorDashboard')}>Back</button>
        </>
      )}
    </div>
  );
};

export default CalendarComponent;