import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";

function RatingForm({ contractorName, contractorId }) {
  const { userData } = useAuth();

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingText, setRatingText] = useState("");

  const handleChange = (e) => {
    setRatingValue(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/addRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId: contractorId,
          contractorName: contractorName,
          clientName: userData.firstName + " " + userData.lastName,
          clientId: userData.userId,
          ratingValue: ratingValue,
          ratingText: ratingText,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Rating added", result);
    } catch (error) {
      console.error("Error submitting booking", error);
    }
    setRatingText(0);
    setRatingText("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Rate {contractorName}</h1>
        <br></br>
        <select id="ratingDropdown" value={ratingValue} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <br></br>
        <label>
          Thoughts:
          <textarea
            value={ratingText}
            onChange={(e) => setRatingText(e.target.value)}
          ></textarea>
        </label>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BookingForm;
