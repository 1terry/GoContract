const express = require('express');
const app = express();
const PORT = 3002; // Change the port if needed
const cors = require('cors');

// Register services array
const services = [];
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Endpoint to register a service
app.post('/register', (req, res) => {
  const { serviceName, serviceURL } = req.body;

  // Check if the service is already registered
  const existingService = services.find(service => service.name === serviceName);

  if (existingService) {
    return res.status(400).json({ error: 'Service already registered' });
  }

  // Register the new service
  services.push({ serviceName: serviceName, serviceURL: serviceURL });
  console.log(`Service registered: ${serviceName} - ${serviceURL}`);

  // Return the list of registered services
  res.json({ services });
});

// Endpoint to get the list of registered services
app.get('/services', (req, res) => {
  res.json({ services });
});

app.post('/unregister', (req, res) => {
  const { serviceName } = req.body;
  // Unregister the service
  const indexToRemove = services.findIndex(service => service.serviceName === serviceName);
  if (indexToRemove !== -1) {
    services.splice(indexToRemove, 1);
    console.log(`Service removed: ${serviceName}`);
  } else {
    console.log(`Service not found: ${serviceName}`);
    return res.status(400).json({ error: 'Service not registered' });
  }
  console.log(`Service unregistered: ${serviceName}`);

  // Return the list of registered services
  res.json({ services });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Registry listening on port ${PORT}`);
});