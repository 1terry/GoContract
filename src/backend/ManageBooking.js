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
const dbBookings = 'bookings';
const dbTrades = 'contractor-trades'
const dbServicesRegistry = 'services';

const { v4: uuidv4 } = require('uuid'); // Import UUID

// getContractor Endpoint
app.get('/getContractorBookings', async (req, res) => {
  const { userId } = req.query; // Assuming the username is passed as a query parameter

  if (!userId) {
    return res.status(400).send('error');
  }

  try {
    // Query to find user by username
    const findUserQuery = {
      selector: { contractorId: userId },
      limit: 1
    };

    const userResponse = await cloudant.postFind({ db: dbBookings, selector: findUserQuery.selector });
    if (userResponse.result.docs.length === 0) {
      return res.status(404).send('User not found');
    }
    const contractorBookings = userResponse.result.docs;
    // Return user data, excluding sensitive information like password
    res.json(contractorBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/declineBooking', async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).send('Booking ID is required');
  }

  try {
    // Fetch the latest document to get the current _rev ID
    const doc = await cloudant.getDocument({ db: dbBookings, docId: bookingId });
    const currentRev = doc.result._rev;

    // Now delete the document with the correct _rev ID
    const deleteResponse = await cloudant.deleteDocument({ db: dbBookings, docId: bookingId, rev: currentRev });
    res.status(200).json({ message: 'Booking declined', id: deleteResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Update Booking Endpoint
app.patch('/acceptBookingRequest', async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).send('Booking ID is required');
  }

  try {
    // Fetch the current booking document
    const doc = await cloudant.getDocument({ db: dbBookings, docId: bookingId });
    const currentBooking = doc.result;

    // Update the status of the booking
    const updatedBooking = {
      ...currentBooking,
      status: true // Set to active
    };

    // Update the document in Cloudant
    const updateResponse = await cloudant.putDocument({ db: dbBookings, docId: bookingId, document: updatedBooking });
    res.status(200).json({ message: 'Booking updated', id: updateResponse.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3005;
const serviceName = 'ManageBookings';
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