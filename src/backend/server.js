require("dotenv").config({
  path: "C:/Users/oofa/Documents/BABY FUN WOOO/GoContract/.env"
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

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

const dbName = "users";
const invoiceDb = "invoice";

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { username, password, userType } = req.body;
  console.log("Request body:", req.body);

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare to find existing user
    const findUserQuery = {
      selector: { username: username },
      limit: 1
    };

    // Check if user already exists
    const existingUsers = await cloudant.postFind({
      db: dbName,
      selector: findUserQuery.selector
    });
    if (existingUsers.result.docs.length > 0) {
      return res.status(400).send("User already exists");
    }

    // Add new user to Cloudant
    const user = { username, password: hashedPassword, userType };
    const response = await cloudant.postDocument({
      db: dbName,
      document: user
    });

    res.status(201).json({ message: "User created", id: response.result.id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Request body:", req.body);

  try {
    // Find user by username
    const findUser = {
      selector: { username: username },
      limit: 1
    };

    const userResponse = await cloudant.postFind({
      db: dbName,
      selector: findUser.selector
    });

    if (userResponse.result.docs.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = userResponse.result.docs[0];
    console.log(userResponse);
    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create invoice endpoint
app.post("/invoice", async (req, res) => {
  const {
    invoiceId,
    invoiceDate,
    dueDate,
    contractorName,
    contractorAddress,
    contractorCity,
    contractorPhone,
    contractorEmail,
    clientName,
    clientAddress,
    clientCity,
    clientPhone,
    clientEmail,
    listOfServices
  } = req.body;
  console.log("Request body:", req.body);

  // If any of the data is missing from the request (which it should not be)
  if (
    !invoiceId ||
    !invoiceDate ||
    !dueDate ||
    !contractorName ||
    !contractorAddress ||
    !contractorCity ||
    !contractorPhone ||
    !contractorEmail ||
    !clientName ||
    !clientAddress ||
    !clientCity ||
    !clientPhone ||
    !clientEmail ||
    !listOfServices
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
      contractorCity,
      contractorPhone,
      contractorEmail,
      clientName,
      clientAddress,
      clientCity,
      clientPhone,
      clientEmail,
      listOfServices
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

// Load a document from the invoice database so the user can view the invoice
app.get("/getInvoice", async (req, res) => {
  const { invoiceId } = req.body;
  console.log("Request Body", req.body);

  // checking that the id is not empty
  if (!invoiceId) {
    return res.status(400).send("Missing invoice id");
  }

  try {
    const findInvoice = {
      selector: { invoiceId: invoiceId },
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
