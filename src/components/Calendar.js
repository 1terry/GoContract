import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Additional actions based on the selected date
  };

  useEffect(() => {
    console.log('Component mounted');
    console.log('Selected Date:', selectedDate);
  }, [selectedDate]);

  return (
    <div>
      <h2>Calendar Example</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      <p>Selected Date: {selectedDate.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;