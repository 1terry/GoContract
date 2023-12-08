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

const dbUsers = 'users';
const dbServices = 'contractor-trades';

const { v4: uuidv4 } = require('uuid'); // Import UUID

// POST Endpoint to add a service
app.post('/addService', async (req, res) => {
  const { trade, description, contractorId, contractorName } = req.body;


  if (!trade || !description || !contractorId) {
    return res.status(400).send('trade, description, and user ID are required');
  }

  try {
    // Create a new service document
    const newService = {
      trade,
      description,
      contractorName,
      contractorId, // Assuming you want to associate the service with a user
      createdAt: new Date().toISOString() // Optional: add a timestamp
    };

    // Insert the document into Cloudant
    const response = await cloudant.postDocument({ db: dbServices, document: newService });
    res.status(201).json({ message: 'Service added', id: response.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const port = process.env.PORT || 3004;
const registryPort = 3002;
const serviceName = "AddService"
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
