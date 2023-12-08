import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Invoice({ data }) {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [inputFields, setInputFields] = useState([{ name: "", value: "" }]);
  const [contractorIdentifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [sampleClientName, setClientName] = useState("");
  const [sampleClientAddress, setClientAddress] = useState("");
  const [sampleClientNumber, setClientNumber] = useState("");
  const [sampleClientEmail, setClientEmail] = useState("");

  const invoiceDate = data.map((record) => {
    return record.InvoiceDate;
  });

  const dueDate = data.map((record) => {
    return record.DueDate;
  });

  const contractorAddress = data.map((record) => {
    return record.ContractorAddress;
  });

  const contractorPhone = data.map((record) => {
    return record.ContractorPhone;
  });

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
          invoiceDate: invoiceDate.toString(),
          dueDate: dueDate.toString(),
          contractorName: userData.firstName + " " + userData.lastName,
          contractorAddress: contractorAddress.toString(),
          contractorPhone: contractorPhone.toString(),
          contractorEmail: userData.username,
          clientName: sampleClientName,
          clientAddress: sampleClientAddress,
          clientPhone: sampleClientNumber,
          clientEmail: sampleClientEmail,
          listOfServices: inputFields
        })
      });
      const data = await response.json();
      if (response.status === 201) {
        setMessage("Invoice saved!");
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
        <p>
          Invoice Date:
          {invoiceDate}
        </p>
        <p>
          Due Date:
          {dueDate}
        </p>
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
            onChange={(e) => setClientName(e.target.value)}
          ></input>
        </label>
        <label>
          Street Address:
          <input
            value={sampleClientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          ></input>
        </label>
        <label>
          Phone Number:
          <input
            value={sampleClientNumber}
            onChange={(e) => setClientNumber(e.target.value)}
            type="number"
          ></input>
        </label>
        <label>
          Email Address:
          <input
            value={sampleClientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          ></input>
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
