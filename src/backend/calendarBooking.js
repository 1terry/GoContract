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

let events = [];
const dbEvents = 'bookings';

app.post('/events/search', async (req, res) => {
  const {userId, date, title } = req.body;
  try {
    const findUserEvents = {
      selector: { contractorId: userId },
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
  const {userId, date, title } = req.body;

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

const port = process.env.PORT || 3003;
const serviceName = 'Calendar';
const registryPort = 3002;
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