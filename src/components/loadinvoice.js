import React, { useState, useEffect } from "react";

// loading the invoice (only for users)
function LoadInvoice({ data }) {
  const [invoice, setinvoice] = useState("");
  var item;

  // immediate call the method
  useEffect(() => {
    grabData();
  }, []);

  const grabData = async () => {
    // loading the data
    try {
      // try hitting the endpoint and loading the data
      const response = await fetch(`/getInvoice?identifier=${data}`);
      if (!response.ok) {
        throw new Error("Network error");
      }
      item = await response.json();
      setinvoice(item);
    } catch (error) {
      console.error("There was an error loading the invoice", error);
    }
  };

  return (
    <div>
      <h1>INVOICE</h1>
      <div>
        <p>Invoice #: {invoice.invoiceId}</p>
        <p>Invoice Date: {invoice.invoiceDate}</p>
        <p>Due Date: {invoice.dueDate}</p>
      </div>
      <div>
        <h2>FROM</h2>
        <p>Name: {invoice.contractorName}</p>
        <p>Address: {invoice.contractorAddress}</p>
        <p>Phone Number: {invoice.contractorPhone}</p>
        <p>Email Address: {invoice.contractorEmail}</p>
      </div>
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
      </div>
    </div>
  );
}

export default LoadInvoice;
