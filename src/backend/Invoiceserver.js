require('dotenv').config();
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
console.log(process.env.CLOUDANT_APIKEY);
console.log(process.env.CLOUDANT_URL);

const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: process.env.CLOUDANT_APIKEY
  }),
  serviceUrl: process.env.CLOUDANT_URL
});

const invoiceDb = "invoice";
const dbUsers = "users";
const dbServices = "contractor-trades";
const dbBookings = "bookings";
const dbTrades = "contractor-trades";
const dbServicesRegistry = 'services';

const { v4: uuidv4 } = require("uuid"); // Import UUID


app.post("/sendInvoiceByEmail", async (req, res) => {
  // const { toEmail, subject, text, html } = req.body; // These should be provided in the request
  // // Configure your email transport
  // const transporter = nodemailer.createTransport({
  //   service: "outlook", // or your preferred email service
  //   auth: {
  //     user: "joemamadelulu", // your email
  //     pass: "JoeMamaSoFat69" // your email password
  //   }
  // });
  // // Define email options
  // const mailOptions = {
  //   from: "joemamadelulu@gmail.com", // sender address
  //   to: toEmail, // receiver (client's email)
  //   subject: subject,
  //   text: text, // plain text body
  //   html: html // html body (optional)
  // };
  // // Send email
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send("Error sending email");
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     res.status(200).send("Email sent successfully");
  //   }
  // });
});

// Create invoice endpoint
app.post("/invoice", async (req, res) => {
  const {
    invoiceId,
    invoiceDate,
    dueDate,
    contractorName,
    contractorAddress,
    contractorPhone,
    contractorEmail,
    clientName,
    clientAddress,
    clientPhone,
    clientEmail,
    listOfServices,
    bookingId
  } = req.body;
  console.log("Request body:", req.body);

  // If any of the data is missing from the request (which it should not be)
  if (
    !invoiceId ||
    !invoiceDate ||
    !dueDate ||
    !contractorName ||
    !contractorAddress ||
    !contractorPhone ||
    !contractorEmail ||
    !clientName ||
    !clientAddress ||
    !clientPhone ||
    !clientEmail ||
    !listOfServices ||
    !bookingId
  ) {
    return res.status(400).send("Invoice data is missing");
  }

  // Try adding the data into the database
  try {
    // Prepare to find existing user
    const findUserQuery = {
      selector: { invoiceId: invoiceId },
      limit: 1
    };

    // Check if user already exists
    const existingUsers = await cloudant.postFind({
      db: invoiceDb,
      selector: findUserQuery.selector
    });
    if (existingUsers.result.docs.length > 0) {
      return res.status(400).send("Invoice already exists");
    }

    // Add new invoice to Cloudant
    const invoiceData = {
      invoiceId,
      invoiceDate,
      dueDate,
      contractorName,
      contractorAddress,
      contractorPhone,
      contractorEmail,
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,
      listOfServices,
      bookingId
    };
    const response = await cloudant.postDocument({
      db: invoiceDb,
      document: invoiceData
    });

    res
      .status(201)
      .json({ message: "Invoice created", id: response.result.id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getInvoiceByBookingId", async (req, res) => {
  const { identifier } = req.query;

  console.log(identifier);

  if (!identifier) {
    return res.status(400).send("Missing booking id");
  }

  try {
    const findInvoice = {
      selector: { bookingId: identifier }
    };

    console.log(findInvoice.selector);

    const existingInvoice = await cloudant.postFind({
      db: invoiceDb,
      selector: findInvoice.selector
    });

    console.log("test");
    console.log(existingInvoice);

    // exists
    if (existingInvoice.result.docs.length === 0) {
      return res.status(404).send("Invoice not found");
    }

    const invoice = existingInvoice.result.docs[0];
    console.log(invoice);
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Load a document from the invoice database so the user can view the invoice
app.get("/getInvoice", async (req, res) => {
  const { identifier } = req.query;
  console.log("Request Body", req.query);

  // checking that the id is not empty
  if (!identifier) {
    return res.status(400).send("Missing invoice id");
  }

  try {
    const findInvoice = {
      selector: { invoiceId: identifier },
      limit: 1
    };

    const existingInvoice = await cloudant.postFind({
      db: invoiceDb,
      selector: findInvoice.selector
    });

    // exists
    if (existingInvoice.result.docs.length === 0) {
      return res.status(404).send("Invoice not found");
    }

    const invoice = existingInvoice.result.docs[0];
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Deleting invoice endpoint
app.delete("/deleteInvoice", async (req, res) => {
  const { invoiceId } = req.query;

  if (!invoiceId) {
    return res.status(400).send("Invoice ID is required!");
  }

  try {
    const doc = await cloudant.getDocument({
      db: invoiceDb,
      docId: invoiceId
    });
    const currentBook = doc.result._rev;

    const deleteResponse = await cloudant.deleteDocument({
      db: invoiceDb,
      docId: invoiceId,
      rev: currentBook
    });

    res.status.json({
      message: "Invoice deleted",
      id: deleteResponse.result.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3007;
const registryPort = 3002;
const serviceName = "Invoice"
app.listen(port, async () => {
    console.log(`${serviceName} is running on http://localhost:${port}`);
  
    // Post registration information to the service registry
    try {
      const registrationData = {
        serviceName: serviceName,
        serviceURL: `http://localhost:${port}`
      };
  
      const registryUrl = `http://localhost:${registryPort}/register`;
      const response = await fetch(registryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
  
      if (response.ok) {
        console.log(`Registered with the service registry at http://localhost:${registryPort}`);
      } else {
        console.error('Failed to register with the service registry');
      }
    } catch (error) {
      console.error('Error registering with the service registry:', error);
    }
    process.on('SIGINT', async () => {
        console.log(`${serviceName} is unregistering...`);
      
        try {
          const unregisterUrl = `http://localhost:${registryPort}/unregister`;
          const response = await fetch(unregisterUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceName }),
          });
      
          if (response.ok) {
            console.log(`Unregistered from the service registry at http://localhost:${registryPort}`);
          } else {
            console.error('Failed to unregister from the service registry');
          }
      
          // Allow some time for the unregister request to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Error unregistering from the service registry:', error);
        }
      
        // Exit the process
        process.exit();
      });
  });