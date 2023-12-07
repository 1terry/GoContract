import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Invoice({ data }) {
  // create a query to the database to get all of the information

  // get all the data that is passed into the invoice component
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

  const displayInvoice = async (event) => {
    try {
      const response = await fetch("http://localhost:3001/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          invoiceDate: invoiceDate,
          dueDate: dueDate,
          contractorName: contractorName,
          contractorAddress: contractorAddress,
          contractorCity: contractorCity,
          contractorPhone: contractorPhone,
          contractorEmail: contractorEmail,
          clientName: clientName,
          clientAddress: clientAddress,
          clientCity: clientCity,
          clientPhone: clientPhone,
          clientEmail: clientEmail
        })
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was an error displaying the invoice", error);
    }
  };

  return (
    <div>
      <input placeholder="Enter invoice date"></input>
      <h1>INVOICE</h1>
      <div>
        <p>
          Invoice #:
          {invoiceId}
        </p>
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
      </div>
      <button onClick={displayInvoice}>Create</button>
    </div>
  );
}

export default Invoice;
