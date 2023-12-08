import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function RatingForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [ratingValue, setRatingValue] = useState("1");
  const [ratingText, setRatingText] = useState("");
  const { contractorName = "", contractorId = "" } = state || {};

  const handleChange = (e) => {
    setRatingValue(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var clientsName = userData.firstName + " " + userData.lastName;

    try {
      const response = await fetch("http://localhost:3001/addRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contractorId: contractorId,
          contractorName: contractorName,
          clientName: clientsName,
          clientId: userData.userId,
          ratingValue: ratingValue,
          ratingText: ratingText
        })
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Rating added", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting ratings", error);
    }
    setRatingValue(1);
    setRatingText("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <br></br>
        <br></br>
        <h1>Rate {contractorName}</h1>
        <br></br>
        <label htmlFor="ratingDropdown">Select a Rating:</label>
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
        <button class="btn btn-success"type="submit">Submit</button>
        <button class="btn btn-warning"onClick={() => navigate("/dashboard")}>Back</button>
      </form>
    </div>
  );
}

export default RatingForm;
