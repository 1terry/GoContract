import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ManageBookings() {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState({ requested: [], active: [] });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/getContractorBookings?userId=${userData.userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const requested = data.filter(booking => booking.status === false);
        const active = data.filter(booking => booking.status === true);
        setBookings({ requested, active });
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (userData && userData.userId) {
      fetchBookings();
    }
  }, [userData]);

  return (
    <div>
      <h2>Requested Bookings</h2>
      <div>
        {/* Render requested bookings here */}
        {bookings.requested.map((booking, index) => (
          <div key={index}>{booking.title}</div> // Example: display booking title
        ))}
      </div>
      <h2>Active Bookings</h2>
      <div>
        {/* Render active bookings here */}
        {bookings.active.map((booking, index) => (
          <div key={index}>{booking.title}</div> // Example: display booking title
        ))}
      </div>
    </div>
  );
}

export default ManageBookings;
