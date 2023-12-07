require('dotenv').config({ path: 'C:/Users/Peyman/Desktop/cs4471/GoContract/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
console.log(process.env.CLOUDANT_APIKEY);
console.log(process.env.CLOUDANT_URL);

const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: process.env.CLOUDANT_APIKEY,
  }),
  serviceUrl: process.env.CLOUDANT_URL,
});

const dbUsers = 'users';
const dbServices = 'services';

const { v4: uuidv4 } = require('uuid'); // Import UUID

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, username, password, userType } = req.body;
  console.log('Request body:', req.body);

  if (!username || !password || !firstName) {
    return res.status(400).send('missing requirements');
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
    const existingUsers = await cloudant.postFind({ db: dbUsers, selector: findUserQuery.selector });
    if (existingUsers.result.docs.length > 0) {
      return res.status(400).send('User already exists');
    }

    // Add new user to Cloudant
    const user = { userId, firstName, lastName, username, password: hashedPassword, userType };
    const response = await cloudant.postDocument({ db: dbUsers, document: user });

    res.status(201).json({ message: 'User created', id: response.result.id, userId });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const findUser = {
      selector: { username: username },
      limit: 1
    };

    const userResponse = await cloudant.postFind({ db: dbUsers, selector: findUser.selector });
    if (userResponse.result.docs.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = userResponse.result.docs[0];
    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }
    // Respond with a message and the userType
    res.json({ 
      message: 'Logged in successfully',
      userType: user.userType // Include the userType in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GetUser Endpoint
app.get('/getUserInfo', async (req, res) => {

  const { username } = req.query; // Assuming the username is passed as a query parameter

  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    // Query to find user by username
    const findUserQuery = {
      selector: { username: username },
      limit: 1
    };

    const userResponse = await cloudant.postFind({ db: dbUsers, selector: findUserQuery.selector });
    if (userResponse.result.docs.length === 0) {
      return res.status(404).send('User not found');
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
app.post('/addService', async (req, res) => {
  const { title, description, userId } = req.body;
  // Validate input
  console.log("test1");
  console.log(title);
  console.log(description);
  console.log(userId);

  if (!title || !description || !userId) {
    return res.status(400).send('Title, description, and user ID are required');
  }
  console.log("test2");

  try {
    // Create a new service document
    const newService = {
      title,
      description,
      userId, // Assuming you want to associate the service with a user
      createdAt: new Date().toISOString() // Optional: add a timestamp
    };
    console.log(newService);

    // Insert the document into Cloudant
    console.log(newService);
    const response = await cloudant.postDocument({ db: dbServices, document: newService });
    res.status(201).json({ message: 'Service added', id: response.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
