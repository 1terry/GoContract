require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

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
    apikey: '7XKuFVh47HPxHkw9J5BgWrJwLkwzafYgN6KNLt0xDhUw',
  }),
  serviceUrl:'https://3debe265-efb1-4d02-86a8-4be42f738690-bluemix.cloudantnosqldb.appdomain.cloud',
});

const invoiceDb = "invoice";
const dbUsers = "users";
const dbServices = "contractor-trades";
const dbBookings = "bookings";
const dbTrades = "contractor-trades";
const dbRatings = "ratings";
const dbServicesRegistry = 'services';

const { v4: uuidv4 } = require("uuid"); // Import UUID

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    phoneNumber,
    username,
    password,
    userType
  } = req.body;
  console.log("Request body:", req.body);

  if (!username || !password || !firstName) {
    return res.status(400).send("missing requirements");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique userId
    const userId = uuidv4();

    // Prepare to find existing user
    const findUserQuery = {
      selector: { username: username },
      limit: 1
    };

    // Check if user already exists
    const existingUsers = await cloudant.postFind({
      db: dbUsers,
      selector: findUserQuery.selector
    });
    if (existingUsers.result.docs.length > 0) {
      return res.status(400).send("User already exists");
    }

    // Add new user to Cloudant
    const user = {
      userId,
      firstName,
      lastName,
      address,
      phoneNumber,
      username,
      password: hashedPassword,
      userType
    };

    // Add manage permissions for contractors
    if (userType === "contractor") {
      user.canManageBookings = true;
      user.canManageTrades = true;
    }

    const response = await cloudant.postDocument({
      db: dbUsers,
      document: user
    });

    res
      .status(201)
      .json({ message: "User created", id: response.result.id, userId });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const findUser = {
      selector: { username: username },
      limit: 1
    };
    const userResponse = await cloudant.postFind({ db: dbUsers, selector: findUser.selector });
    if (userResponse.result.docs.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = userResponse.result.docs[0];
    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }
    // Respond with a message and the userType
    res.json({
      message: "Logged in successfully",
      userType: user.userType // Include the userType in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// GetUser Endpoint
app.get("/getUserInfo", async (req, res) => {
  const { username } = req.query; // Assuming the username is passed as a query parameter

  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    // Query to find user by username
    const findUserQuery = {
      selector: { username: username },
      limit: 1
    };

    const userResponse = await cloudant.postFind({
      db: dbUsers,
      selector: findUserQuery.selector
    });
    if (userResponse.result.docs.length === 0) {
      return res.status(404).send("User not found");
    }
    const user = userResponse.result.docs[0];
    // Return user data, excluding sensitive information like password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Endpoint to add a service
app.post("/addService", async (req, res) => {
  const { trade, description, contractorId, contractorName } = req.body;
  console.log("trade:", trade);
  console.log("desc:", description);
  console.log("id:", contractorId);
  console.log("name:", contractorName);


  if (!trade || !description || !contractorId) {
    return res.status(400).send("trade, description, and user ID are required");
  }
  console.log("test2");

  try {
    // Create a new service document
    const newService = {
      trade,
      description,
      contractorName,
      contractorId, // Assuming you want to associate the service with a user
      createdAt: new Date().toISOString() // Optional: add a timestamp
    };
    console.log(newService);

    // Insert the document into Cloudant
    console.log(newService);
    const response = await cloudant.postDocument({
      db: dbServices,
      document: newService
    });
    res.status(201).json({ message: "Service added", id: response.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify performSearch to handle an array of users
const performSearch = (data, contractorName) => {
  const searchWord = contractorName;
  if (!searchWord) {
    return data; // Return all users if no search term provided
  }

  return data.filter((value) =>
    value.contractorName.toLowerCase().includes(searchWord.toLowerCase()) 
  );
};

const performTradeNameSearch = (data, contractorName) => {
  const searchWord = contractorName;
  if (!searchWord) {
    return data; // Return all users if no search term provided
  }

  return data.filter((value) =>
    value.trade.toLowerCase().includes(searchWord.toLowerCase() 
  ));
};

const performRatingSearch = (data, contractorId) => {
  const searchWord = contractorId;
  if (!searchWord) {
    return data; // Return all users if no search term provided
  }

  return data.filter((value) =>
    value.contractorId.toLowerCase().includes(searchWord.toLowerCase() 
  ));
};

// Modify Search Endpoint
app.post('/search', async (req, res) => {
  try {
    const { contractorName } = req.body;
    console.log('Request body: ', contractorName, req.body);

    // Fetch all users dynamically from Cloudant
    const findAllUsersQuery = {};
    
    const usersResponse = await cloudant.postFind({ db: dbServices, selector: findAllUsersQuery });

    // Extract data from the Cloudant response (modify this based on your Cloudant structure)
    const data = usersResponse.result.docs;

    console.log('data', data);
    console.log('contractor', contractorName);

    // Perform search filtering
    const filteredData = performSearch(data, contractorName);

    console.log('filtered data', filteredData);

    // If no results, return a 404 response
    if (filteredData.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    res.json({ message: 'Results found', users: filteredData });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/searchTrade', async (req, res) => {
  try {
    const { contractorName } = req.body;
    console.log('Request body: ', contractorName, req.body);

    // Fetch all users dynamically from Cloudant
    const findAllUsersQuery = {};
    
    const usersResponse = await cloudant.postFind({ db: dbServices, selector: findAllUsersQuery });

    // Extract data from the Cloudant response (modify this based on your Cloudant structure)
    const data = usersResponse.result.docs;

    console.log('data', data);
    console.log('contractor', contractorName);

    // Perform search filtering
    const filteredData = performTradeNameSearch(data, contractorName);

    console.log('filtered data', filteredData);

    // If no results, return a 404 response
    if (filteredData.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    res.json({ message: 'Results found', users: filteredData });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Endpoint to add a booking
app.post('/addBooking', async (req, res) => {
  console.log('Request payload:', req.body);

  const {
    contractorId,
    contractorName,
    clientName,
    clientId,
    clientEmail,
    date,
    typeOfService,
    serviceDetails,
    status
  } = req.body;

  // Validate input
  if (
    !contractorId ||
    !contractorName ||
    !clientName ||
    !clientId ||
    !clientEmail ||
    !date ||
    !typeOfService ||
    !serviceDetails ||
    status == null
  ) {
    console.log( contractorId,
      contractorName,
      clientName,
      clientId,
      clientEmail,
      date,
      typeOfService,
      serviceDetails,
      status);
    return res.status(400).send('Invalid request parameters');
  }

  try {
    // Create a new booking document
    const newBooking = {
      contractorId,
      contractorName,
      clientName,
      clientId,
      clientEmail,
      date,
      typeOfService,
      serviceDetails,
      status,
      createdAt: new Date().toISOString() // Optional: add a timestamp
    };
    // Insert the document into Cloudant or your preferred database
    const response = await cloudant.postDocument({ db: dbBookings, document: newBooking });

    res.status(201).json({ message: 'Booking added', id: response.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/rating', async (req, res) => {
  const {
    contractorId
  } = req.body

  if (contractorId) {

  }
})

// POST Endpoint to add a booking
app.post('/addRating', async (req, res) => {
  console.log('Request payload:', req.body);

  const {
    contractorId,
    contractorName,
    clientName,
    clientId,
    ratingValue,
    ratingText,
    // status
  } = req.body;

  // Validate input
  if (
    !contractorId ||
    !contractorName ||
    !clientName ||
    !clientId ||
    !ratingValue
    // status == null
  ) {
    console.log(     contractorId,
      contractorName,
      clientName,
      clientId,
      ratingValue,
      ratingText,
      // status
      );
    return res.status(400).send('Invalid request parameters');
  }

  try {
    // Create a new booking document
    const newRating = {
      contractorId,
      contractorName,
      clientName,
      clientId,
      ratingValue,
      ratingText,
      // status,
      // createdAt: new Date().toISOString() // Optional: add a timestamp
    };

    console.log()
    // Insert the document into Cloudant or your preferred database
    const response = await cloudant.postDocument({ db: dbRatings, document: newRating });

    res.status(201).json({ message: 'Rating added', id: response.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// getContractor Endpoint
app.get("/getContractorBookings", async (req, res) => {
  const { userId } = req.query; // Assuming the username is passed as a query parameter

  if (!userId) {
    return res.status(400).send("error");
  }

  try {
    // Query to find user by username
    const findUserQuery = {
      selector: { contractorId: userId },
      limit: 1
    };

    const userResponse = await cloudant.postFind({
      db: dbBookings,
      selector: findUserQuery.selector
    });
    if (userResponse.result.docs.length === 0) {
      return res.status(404).send("User not found");
    }
    const contractorBookings = userResponse.result.docs;
    // Return user data, excluding sensitive information like password
    res.json(contractorBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

app.delete("/declineBooking", async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).send("Booking ID is required");
  }

  try {
    // Fetch the latest document to get the current _rev ID
    const doc = await cloudant.getDocument({
      db: dbBookings,
      docId: bookingId
    });
    const currentRev = doc.result._rev;

    // Now delete the document with the correct _rev ID
    const deleteResponse = await cloudant.deleteDocument({
      db: dbBookings,
      docId: bookingId,
      rev: currentRev
    });
    res
      .status(200)
      .json({ message: "Booking declined", id: deleteResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Update Booking Endpoint
app.patch("/acceptBookingRequest", async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).send("Booking ID is required");
  }

  try {
    // Fetch the current booking document
    const doc = await cloudant.getDocument({
      db: dbBookings,
      docId: bookingId
    });
    const currentBooking = doc.result;

    // Update the status of the booking
    const updatedBooking = {
      ...currentBooking,
      status: true // Set to active
    };

    // Update the document in Cloudant
    const updateResponse = await cloudant.putDocument({
      db: dbBookings,
      docId: bookingId,
      document: updatedBooking
    });
    res
      .status(200)
      .json({ message: "Booking updated", id: updateResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteTrade", async (req, res) => {
  const { tradeId } = req.query;
  if (!tradeId) {
    return res.status(400).send("Booking ID is required");
  }

  try {
    console.log();
    // Fetch the latest document to get the current _rev ID
    const doc = await cloudant.getDocument({ db: dbTrades, docId: tradeId });
    const currentRev = doc.result._rev;
    // Now delete the document with the correct _rev ID
    const deleteResponse = await cloudant.deleteDocument({
      db: dbTrades,
      docId: tradeId,
      rev: currentRev
    });
    res
      .status(200)
      .json({ message: "Booking declined", id: deleteResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getContractorTrades", async (req, res) => {
  const { userId } = req.query; // Assuming the username is passed as a query parameter

  if (!userId) {
    return res.status(400).send("error");
  }

  try {
    // Query to find user by username
    const findUserQuery = {
      selector: { contractorId: userId },
      limit: 1
    };

    const userResponse = await cloudant.postFind({
      db: dbTrades,
      selector: findUserQuery.selector
    });
    if (userResponse.result.docs.length === 0) {
      return res.status(404).send("User not found");
    }
    const contractorTrades = userResponse.result.docs;
    // Return user data, excluding sensitive information like password
    res.json(contractorTrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

let events = [];
const dbEvents = 'events';

app.post('/events/search', async (req, res) => {
  const {userId, date, title } = req.body;
  try {
    const findUserEvents = {
      selector: { userId: userId },
    };
    const eventsData = await cloudant.postFind({ db: dbEvents, selector: findUserEvents.selector });
    const jsonResponse = JSON.parse(JSON.stringify(eventsData.result));
    const { docs } = eventsData.result;
    res.json(docs)
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookings/contractorsearch', async (req, res) => {
  const {userId, date, title } = req.body;
  try {
    const findUserEvents = {
      selector: { contractorId: userId },
    };
    const eventsData = await cloudant.postFind({ db: dbBookings, selector: findUserEvents.selector });
    const jsonResponse = JSON.parse(JSON.stringify(eventsData.result));
    const { docs } = eventsData.result;
    console.log(docs)
    res.json(docs)
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookings/clientsearch', async (req, res) => {
  const {userId, date, title } = req.body;
  try {
    const findUserEvents = {
      selector: { contractorId: userId },
    };
    const eventsData = await cloudant.postFind({ db: dbBookings, selector: findUserEvents.selector });
    const jsonResponse = JSON.parse(JSON.stringify(eventsData.result));
    const { docs } = eventsData.result;
    res.json(docs)
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// POST endpoint to add a new event

app.post('/events', async (req, res) => {
  const {userId, date, title } = req.body;
  console.log('Request body:', req.body); 

  if (!date || !title) {
    return res.status(400).send('Date and title are required.');
  }

  try {
    const newEvent = {userId, date, title};
    events.push(newEvent);

    // Add new event to Cloudant
    const response = await cloudant.postDocument({ db: dbEvents, document: newEvent });

    res.status(201).json({ message: 'Events created', id: response.result.id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update UserProfile Endpoint in server.js
app.patch("/updateUserProfile", async (req, res) => {
  const { docId, updates } = req.body;

  if (!docId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const doc = await cloudant.getDocument({ db: dbUsers, docId: docId });
    const currentUser = doc.result;
    // Update the user document with the new fields
    const updatedUser = {
      ...currentUser,
      ...updates, // This contains the fields to be updated
      _rev: currentUser._rev // Include the latest _rev ID
    };

    // Update the document in Cloudant
    const updateResponse = await cloudant.putDocument({
      db: dbUsers,
      docId: docId,
      document: updatedUser
    });
    res
      .status(200)
      .json({ message: "User profile updated", id: updateResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteUserAccount", async (req, res) => {
  const { docId } = req.query;

  if (!docId) {
    return res.status(400).send("User ID is required");
  }

  try {
    // Fetch the current user document to get the _rev ID
    const doc = await cloudant.getDocument({ db: dbUsers, docId: docId });
    const currentRev = doc.result._rev;

    // Delete the document using the _rev ID
    await cloudant.deleteDocument({
      db: dbUsers,
      docId: docId,
      rev: currentRev
    });
    res.status(200).send("User account deleted successfully");
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/getContractorRating', async (req, res) => {
  const { contractorId } = req.query;

  if (!contractorId) {
    return res.status(400).send('Contractor ID is required');
  }

  try {
    // Fetch all ratings for the given contractorId
    const findRatingsQuery = {
      selector: { contractorId: contractorId }
    };
    console.log()
    const ratingsResponse = await cloudant.postFind({ 
      db: dbRatings, 
      selector: findRatingsQuery.selector 
    });

    const ratings = ratingsResponse.result.docs;

    // Calculate the average rating
    const totalRating = ratings.reduce((sum, rating) => sum + parseInt(rating.ratingValue, 10), 0);
    const averageRating = ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 'No ratings';

    res.json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/deleteEvent', async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) {
    return res.status(400).send('Event is required');
  }

  try {
    // Fetch the latest document to get the current _rev ID
    const doc = await cloudant.getDocument({ db: dbEvents, docId: eventId });
    const currentRev = doc.result._rev;
    // Now delete the document with the correct _rev ID
    const deleteResponse = await cloudant.deleteDocument({ db: dbEvents, docId: eventId, rev: currentRev });
    res.status(200).json({ message: 'Event deleted', id: deleteResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
