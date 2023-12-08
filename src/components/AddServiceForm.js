// src/components/AddServiceForm.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AddServiceForm({ onClose, onServiceAdded }) {
  const { userData } = useAuth();
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/addService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trade: serviceTitle,
          description: serviceDescription,
          contractorId: userData.userId, // Assuming userData contains userId
          contractorName: userData.firstName.concat(" ", userData.lastName)
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Service added:", result);
      onServiceAdded();
      onClose(); // Close form on successful submission
    } catch (error) {
      console.error("Error submitting service:", error);
    }

    setServiceDescription("");
    setServiceTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Trade:
          <input
            type="text"
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          ></textarea>
        </label>
      </div>
      <button type="submit">Submit Trade</button>
      <button onClick={() => onClose()}>Cancel</button>
    </form>
  );
}

export default AddServiceForm;
