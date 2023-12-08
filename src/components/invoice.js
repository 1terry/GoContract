import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function Invoice() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const location = useLocation();
  const { bookingId, clientEmail } = location.state;

  const [inputFields, setInputFields] = useState([{ name: "", value: "" }]);
  const [contractorIdentifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [sampleClientName, setClientName] = useState("");
  const [sampleClientAddress, setClientAddress] = useState("");
  const [sampleClientNumber, setClientNumber] = useState("");
  const [sampleClientEmail, setClientEmail] = useState("");
  const [invoiceDueDate, setDueDate] = useState("");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  const sendEmail = async () => {
    try {
      const emailResponse = await fetch(
        "http://localhost:3001/sendInvoiceByEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            toEmail: clientEmail, // Client's email address
            subject: `Hello ${sampleClientName}`,
            text: "Here are the details of your invoice...", // The content of the email
            html: "<p>HTML version of your invoice details</p>" // Optionally, you can use HTML
          })
        }
      );

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const saveInvoice = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:3001/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoiceId: contractorIdentifier.toString(),
          invoiceDate: today.toString(),
          dueDate: invoiceDueDate,
          contractorName: userData.firstName + " " + userData.lastName,
          contractorAddress: userData.address,
          contractorPhone: userData.phoneNumber,
          contractorEmail: userData.username,
          clientName: sampleClientName,
          clientAddress: sampleClientAddress,
          clientPhone: sampleClientNumber,
          clientEmail: clientEmail,
          listOfServices: inputFields,
          bookingId: bookingId
        })
      });
      const data = await response.json();
      if (response.status === 201) {
        setMessage("Invoice saved!");
        // await sendEmail(); // Email not working; no free account
      } else {
        setMessage("Invoice save error.");
      }
    } catch (error) {
      console.error("There was an error displaying the invoice", error);
    }
  };

  const handleFormChange = (index, event) => {
    let serviceItemsData = [...inputFields];
    serviceItemsData[index][event.target.name] = event.target.value;
    setInputFields(serviceItemsData);
  };

  const addFields = () => {
    let newfield = { name: "", value: "" };
    setInputFields([...inputFields, newfield]);
  };

  const removeFields = (index) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };

  return (
    <div>
      <h1>INVOICE</h1>
      <div>
        <p>Invoice #:</p>
        <input
          type="identifier"
          placeholder="Enter invoice id"
          value={contractorIdentifier}
          onChange={(e) => setIdentifier(e.target.value)}
        ></input>

        <p> Booking id = {bookingId}</p>

        <p>
          Invoice Date:
          {today}
        </p>
        <label>
          Due Date:
          <input
            type="date"
            value={invoiceDueDate}
            placeholder="mm-dd-yyyy"
            onChange={(e) => setDueDate(e.target.value)}
          ></input>
        </label>
      </div>
      <div>
        <h2>FROM</h2>
        <p>
          Name:
          {userData.firstName + " " + userData.lastName}
        </p>
        <p>
          Address:
          {userData.address}
        </p>
        <p>
          Phone Number:
          {userData.phoneNumber}
        </p>
        <p>Email Address: {userData.username}</p>
      </div>
      <div>
        <h2>TO</h2>
        <label>
          Name:
          <input
            value={sampleClientName}
            placeholder="Enter client name"
            onChange={(e) => setClientName(e.target.value)}
          ></input>
        </label>
        <label>
          Street Address:
          <input
            value={sampleClientAddress}
            placeholder="Enter client address"
            onChange={(e) => setClientAddress(e.target.value)}
          ></input>
        </label>
        <label>
          Phone Number:
          <input
            value={sampleClientNumber}
            placeholder="Enter client phone number"
            onChange={(e) => setClientNumber(e.target.value)}
            type="number"
          ></input>
        </label>
        <label>
          Email Address:
          <p>{clientEmail}</p>
        </label>
        <p>List of Services:</p>
        <form>
          {inputFields.map((input, index) => {
            return (
              <div key={index}>
                <input
                  name="name"
                  placeholder="Service name"
                  value={input.name}
                  onChange={(event) => handleFormChange(index, event)}
                ></input>
                <input
                  name="value"
                  placeholder="Value"
                  value={input.value}
                  onChange={(event) => handleFormChange(index, event)}
                ></input>
                <button onClick={() => removeFields(index)}>Remove</button>
              </div>
            );
          })}
        </form>
        <button onClick={addFields}>Add more services</button>
      </div>
      <button onClick={saveInvoice}>Save Invoice</button>
      <button onClick={() => navigate("/contractorDashboard")}>Back</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default Invoice;
