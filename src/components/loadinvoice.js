import React, { useState, useEffect } from "react";

// loading the invoice (only for users)
function LoadInvoice({ data }) {
  const [invoice, setinvoice] = useState("");
  const [message, setMessage] = useState("");
  const [enteredInvoiceId, setInvoiceId] = useState("");
  var item;

  const grabData = async () => {
    setMessage("");
    setinvoice("");
    // loading the data
    try {
      // try hitting the endpoint and loading the data
      const response = await fetch(
        `/getInvoice?identifier=${enteredInvoiceId}`
      );
      if (!response.ok) {
        throw new Error("Network error");
      }
      item = await response.json();
      setinvoice(item);
    } catch (error) {
      console.error("There was an error loading the invoice", error);
    }
  };

  const deletingInvoice = async () => {
    try {
      const response = await fetch(`/deleteInvoice?invoiceId=${invoice._id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }
    } catch (error) {
      setMessage("Delete successful!");
      console.error("There was an error loading the invoice", error);
    }
  };

  return (
    <div>
      <label>
        Enter an invoice id:
        <input
          placeholder="Enter invoice id"
          value={enteredInvoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
        ></input>
      </label>

      <button onClick={grabData}>Search for invoice</button>

      {!invoice && <h2>No invoice found</h2>}

      {!message && invoice && <h1>INVOICE</h1>}

      {!message && invoice && (
        <div>
          <p>Invoice #: {invoice.invoiceId}</p>
          <p>Invoice Date: {invoice.invoiceDate}</p>
          <p>Due Date: {invoice.dueDate}</p>
        </div>
      )}
      {!message && invoice && (
        <div>
          <h2>FROM</h2>
          <p>Name: {invoice.contractorName}</p>
          <p>Address: {invoice.contractorAddress}</p>
          <p>Phone Number: {invoice.contractorPhone}</p>
          <p>Email Address: {invoice.contractorEmail}</p>
        </div>
      )}

      {!message && invoice && (
        <div>
          <h2>TO</h2>
          <p>Name: {invoice.clientName}</p>
          <p>Street Address: {invoice.clientAddress}</p>
          <p>Phone Number: {invoice.clientPhone}</p>
          <p>Email Address: {invoice.clientEmail}</p>
          <ul>
            {invoice.listOfServices?.map((item) => (
              <div>
                <p> Item: {item.name}</p>
                <ul> Cost: ${item.value}</ul>
              </div>
            ))}
          </ul>

          <button onClick={deletingInvoice}>Delete Invoice</button>
        </div>
      )}
      {message && <div>{message}</div>}
    </div>
  );
}

export default LoadInvoice;
