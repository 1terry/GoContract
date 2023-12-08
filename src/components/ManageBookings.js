import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ManageBookings() {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState({ requested: [], active: [] });
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState('');
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setServiceName("ManageBookings")
        const service = await fetch(`http://localhost:3002/services`);
        const Data = await service.json();
        // Assuming data is an array, filter based on serviceName
        const ServiceData = Data.services.filter(service => service.serviceName == 'ManageBookings');
        if (!ServiceData || ServiceData.length === 0) {
          console.error('Service unavailable');
          return;
        }
        setServices(ServiceData)
        const response = await fetch(`${ServiceData[0].serviceURL}/getContractorBookings?userId=${userData.userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const bookingsData = await response.json();

        if (Array.isArray(bookingsData)) {
          const requested = bookingsData.filter((booking) => !booking.status);
          const active = bookingsData.filter((booking) => booking.status);
          setBookings({ requested, active });
        } else {
          console.error(
            "Expected an array of bookings, but received:",
            bookingsData
          );
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (userData && userData.userId) {
      fetchBookings();
    }
  }, [userData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter bookings by client name, handling cases where clientName might be undefined
  // Filter bookings by client name, ensuring the name starts with the search term
  const filteredBookings = {
    requested: bookings.requested.filter((booking) =>
      booking.clientName?.toLowerCase().startsWith(searchTerm.toLowerCase())
    ),
    active: bookings.active.filter((booking) =>
      booking.clientName?.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  };

  const handleDecline = async (bookingId, isRequested = true) => {
    try {
      const response = await fetch(`${services[0].serviceURL}/declineBooking?bookingId=${bookingId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error("Failed to decline booking");
      }
  
      // Update the state based on the type of booking (requested or active)
      setBookings((prevState) => {
        if (isRequested) {
          return {
            ...prevState,
            requested: prevState.requested.filter(booking => booking._id !== bookingId),
          };
        } else {
          return {
            ...prevState,
            active: prevState.active.filter(booking => booking._id !== bookingId),
          };
        }
      });
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };
  
  const handleAccept = async (bookingId) => {
    try {
      const response = await fetch(`${services[0].serviceURL}/acceptBookingRequest?bookingId=${bookingId}`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error("Failed to accept booking");
      }

      // Update the state to move the accepted booking to active
      setBookings((prevState) => {
        const updatedRequested = prevState.requested.filter(
          (booking) => booking._id !== bookingId
        );
        const acceptedBooking = prevState.requested.find(
          (booking) => booking._id === bookingId
        );
        const updatedActive = [
          ...prevState.active,
          { ...acceptedBooking, status: true }
        ];

        return { requested: updatedRequested, active: updatedActive };
      });
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleInvoiceClick = async (bookingId, clientEmail) => {
    try {
      const service = await fetch(`http://localhost:3002/services`);
      const Data = await service.json();
      const ServiceData = Data.services.filter(service => service.serviceName == 'Invoice');
        if (!ServiceData || ServiceData.length === 0) {
          console.error('Service unavailable');
          return;
        }
      const response = await fetch(
        `${ServiceData[0].serviceURL}/getInvoiceByBookingId?identifier=${bookingId}`
      );

      const invoice = await response.json();
      if (invoice) {
        navigate(`/getInvoice`, { state: { invoiceId: invoice.invoiceId } });
      }
    } catch (error) {
      const service = await fetch(`http://localhost:3002/services`);
      const Data = await service.json();
      const ServiceData = Data.services.filter(service => service.serviceName == 'Invoice');
        if (!ServiceData || ServiceData.length === 0) {
          console.error('Service unavailable');
          return;
        }
      navigate(`/invoice`, {
        state: { bookingId: bookingId, clientEmail: clientEmail }
      });
    }
  };

  return (
    <div>
      {!services || services.length === 0? (
        <div>
          <button onClick={() => navigate('/contractorDashboard')}>Back</button>
          <h2>Service not available.</h2>
        </div>
        ) : (
          <>
          <button onClick={() => navigate('/contractorDashboard')}>Back</button>
          <h3>Search Clients</h3>
          <input
            type="text"
            placeholder="Search by Client Name"
            value={searchTerm}
            onChange={handleSearchChange}
          />

      <h2>Requested Bookings</h2>
      <div>
        {filteredBookings.requested.map((booking, index) => (
          <div key={index}>
            <h3>{booking.typeOfService}</h3>
            <p>Details: {booking.serviceDetails}</p>
            <p>client name: {booking.clientName}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Booking ID: {booking._id}</p>
            <button class="btn btn-danger" onClick={() => handleDecline(booking._id)}>Decline</button>
            <button class="btn btn-success" onClick={() => handleAccept(booking._id)}>Accept</button>
          </div>
        ))}
      </div>
      <h2>Active Bookings</h2>
      <div>
        {filteredBookings.active.map((booking, index) => (
          <div key={index}>
            <h4>{booking.typeOfService}</h4>
            <p>Details: {booking.serviceDetails}</p>
            <p>client name: {booking.clientName}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Booking ID: {booking._id}</p>
            <button class="btn btn-danger"onClick={() => handleDecline(booking._id,false)}>
              Cancel Job
            </button>
            <button class="btn btn-success"
              onClick={() =>
                handleInvoiceClick(booking._id, booking.clientEmail)
              }
            >
              Invoice
            </button>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
  
}

export default ManageBookings;
