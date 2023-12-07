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
    apikey: '7XKuFVh47HPxHkw9J5BgWrJwLkwzafYgN6KNLt0xDhUw',
  }),
  serviceUrl:'https://3debe265-efb1-4d02-86a8-4be42f738690-bluemix.cloudantnosqldb.appdomain.cloud',
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

// Modify performSearch to handle an array of users
const performSearch = (data, contractorName) => {
  const searchWord = contractorName;
  if (!searchWord) {
    return data; // Return all users if no search term provided
  }

  return data.filter((value) =>
    value.username.toLowerCase().includes(searchWord.toLowerCase())
  );
};

// Modify Search Endpoint
app.post('/search', async (req, res) => {
  try {
    const { contractorName } = req.body;
    console.log('Request body: ', contractorName, req.body);

    // Fetch all users dynamically from Cloudant
    const findAllUsersQuery = {};
    const usersResponse = await cloudant.postFind({ db: dbName, selector: findAllUsersQuery });

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



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
