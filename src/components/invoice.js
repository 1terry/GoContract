import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Invoice({ data }) {
  // create a query to the database to get all of the information

  const [extraData, setData] = React.useState([]);

  const [inputFields, setInputFields] = useState([{ name: "", value: "" }]);

  const [contractorIdentifier, setIdentifier] = useState("");

  const [message, setMessage] = useState("");

  // this needs to be changed to what the current contractor is
  const invoiceId = data.map((record) => {
    return record.InvoiceId;
  });

  const invoiceDate = data.map((record) => {
    return record.InvoiceDate;
  });

  const dueDate = data.map((record) => {
    return record.DueDate;
  });

  const contractorName = data.map((record) => {
    return record.ContractorName;
  });

  const contractorAddress = data.map((record) => {
    return record.ContractorAddress;
  });

  const contractorCity = data.map((record) => {
    return record.ContractorCity;
  });

  const contractorPhone = data.map((record) => {
    return record.ContractorPhone;
  });

  const contractorEmail = data.map((record) => {
    return record.ContractorEmail;
  });

  const clientName = data.map((record) => {
    return record.ClientNames;
  });

  const clientAddress = data.map((record) => {
    return record.ClientAddress;
  });

  const clientCity = data.map((record) => {
    return record.ClientCity;
  });

  const clientPhone = data.map((record) => {
    return record.ClientPhone;
  });

  const clientEmail = data.map((record) => {
    return record.ClientEmail;
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
          contractorName: contractorName.toString(),
          contractorAddress: contractorAddress.toString(),
          contractorCity: contractorCity.toString(),
          contractorPhone: contractorPhone.toString(),
          contractorEmail: contractorEmail.toString(),
          clientName: clientName.toString(),
          clientAddress: clientAddress.toString(),
          clientCity: clientCity.toString(),
          clientPhone: clientPhone.toString(),
          clientEmail: clientEmail.toString(),
          listOfServices: inputFields
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        console.log("Saved invoice!", data);
        setMessage("Invoice saved!");
      } else {
        console.error("Invoice not saved.");
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
      {message && <div>{message}</div>}
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
          {contractorName}
        </p>
        <p>
          Address:
          {contractorAddress}
        </p>
        <p>
          City, State ZIP:
          {contractorCity}
        </p>
        <p>
          Phone Number:
          {contractorPhone}
        </p>
        <p>Email Address: {contractorEmail}</p>
      </div>
      <div>
        <h2>TO</h2>
        <p>
          Name:
          {clientName}
        </p>
        <p>
          Street Address:
          {clientAddress}
        </p>
        <p>
          City, State ZIP:
          {clientCity}
        </p>
        <p>
          Phone Number:
          {clientPhone}
        </p>
        <p>
          Email Address:
          {clientEmail}
        </p>
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
    </div>
  );
}

export default Invoice;
