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

const dbName = 'users';

// Signup Endpoint
app.post('/signup', async (req, res) => {
    const { username, password, userType } = req.body;
    console.log('Request body:', req.body); 

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
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
      const existingUsers = await cloudant.postFind({ db: dbName, selector: findUserQuery.selector });
      if (existingUsers.result.docs.length > 0) {
        return res.status(400).send('User already exists');
      }
  
      // Add new user to Cloudant
      const user = { username, password: hashedPassword, userType };
      const response = await cloudant.postDocument({ db: dbName, document: user });
  
      res.status(201).json({ message: 'User created', id: response.result.id });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Request body:', req.body); 

  try {
    // Find user by username
    const findUser = {
      selector: { username: username },
      limit: 1
    };

    const userResponse = await cloudant.postFind({ db: dbName, selector: findUser.selector });

    if (userResponse.result.docs.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = userResponse.result.docs[0];
    console.log(userResponse);
    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

let events = [];
const dbEvents = 'events';

app.post('/events/search', async (req, res) => {
  const {username, date, title } = req.body;
  try {
    const findUserEvents = {
      selector: { username: username },
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
// POST endpoint to add a new event

app.post('/events', async (req, res) => {
  const {username, date, title } = req.body;
  console.log('Request body:', req.body); 

  if (!date || !title) {
    return res.status(400).send('Date and title are required.');
  }

  try {
    const newEvent = {username, date, title};
    events.push(newEvent);

    // Add new event to Cloudant
    const response = await cloudant.postDocument({ db: dbEvents, document: newEvent });

    res.status(201).json({ message: 'Events created', id: response.result.id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));