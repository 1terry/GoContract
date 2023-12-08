import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

// loading the invoice (only for users)
function LoadInvoice({ data }) {
  const [message, setMessage] = useState("");
  const [enteredInvoiceId, setInvoiceId] = useState("");
  const { userData } = useAuth();
  var item;
  const { bookingId } = useParams();
  const [invoice, setinvoice] = useState("");
  const location = useLocation();
  const passedVariable = location.state?.invoiceId;
  const navigate = useNavigate();

  useEffect(() => {
    grabData();
  }, []);

  const grabData = async () => {
    setMessage("");
    // loading the data
    try {
      // try hitting the endpoint and loading the data
      const response = await fetch(`/getInvoice?identifier=${passedVariable}`);
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
      {!message && <h1>INVOICE</h1>}

      {!message && (
        <div>
          <p>Invoice #: {invoice.invoiceId}</p>
          <p>Invoice Date: {invoice.invoiceDate}</p>
          <p>Due Date: {invoice.dueDate}</p>
        </div>
      )}
      {!message && (
        <div>
          <h2>FROM</h2>
          <p>Name: {invoice.contractorName}</p>
          <p>Address: {invoice.contractorAddress}</p>
          <p>Phone Number: {invoice.contractorPhone}</p>
          <p>Email Address: {invoice.contractorEmail}</p>
        </div>
      )}

      {!message && (
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
      <button onClick={() => navigate("/contractorDashboard")}>Back</button>
    </div>
  );
}

export default LoadInvoice;
