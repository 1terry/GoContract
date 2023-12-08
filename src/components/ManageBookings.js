import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function ManageBookings() {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState({ requested: [], active: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/getContractorBookings?userId=${userData.userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const bookingsData = await response.json();
    
        if (Array.isArray(bookingsData)) {
          const requested = bookingsData.filter(booking => !booking.status);
          const active = bookingsData.filter(booking => booking.status);
          setBookings({ requested, active });
        } else {
          console.error('Expected an array of bookings, but received:', bookingsData);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };    

    if (userData && userData.userId) {
      fetchBookings();
    }
  }, [userData]);

  const handleDecline = async (bookingId) => {
    try {
      const response = await fetch(`/declineBooking?bookingId=${bookingId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to decline booking');
      }

      // Update the state to remove the declined booking
      setBookings(prevState => ({
        ...prevState,
        requested: prevState.requested.filter(booking => booking._id !== bookingId)
      }));
    } catch (error) {
      console.error('Error declining booking:', error);
    }
  };



  const handleAccept = async (bookingId) => {
    try {
      const response = await fetch(`/acceptBookingRequest?bookingId=${bookingId}`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to accept booking');
      }

      // Update the state to move the accepted booking to active
      setBookings(prevState => {
        const updatedRequested = prevState.requested.filter(booking => booking._id !== bookingId);
        const acceptedBooking = prevState.requested.find(booking => booking._id === bookingId);
        const updatedActive = [...prevState.active, { ...acceptedBooking, status: true }];
        
        return { requested: updatedRequested, active: updatedActive };
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };


  return (
    <div>
      <button onClick={() => navigate('/contractorDashboard')}>Back</button>
      <h2>Requested Bookings</h2>
      <div>
        {bookings.requested.map((booking, index) => (
          <div key={index}>
            <h3>{booking.typeOfService}</h3>
            <p>Details: {booking.serviceDetails}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Client ID: {booking.clientId}</p>
            <button onClick={() => handleDecline(booking._id)}>Decline</button>
            <button onClick={() => handleAccept(booking._id)}>Accept</button>
          </div>
        ))}
      </div>
      <h2>Active Bookings</h2>
      <div>
        {bookings.active.map((booking, index) => (
          <div key={index}>
            <h3>{booking.typeOfService}</h3>
            <p>Details: {booking.serviceDetails}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Client ID: {booking.clientId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageBookings;
