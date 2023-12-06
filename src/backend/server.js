const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors'); // Add this line
const bodyParser = require('body-parser'); // Add this line to parse JSON in the request body
const app = express();

app.use(bodyParser.json());
// Enable CORS
app.use(cors());
const port = 3001; // Choose a port number

let events = [];

app.use(cors()); // Add this line to enable CORS

const initialize = async () => {
  try {
    const eventsFilePath = path.join(__dirname, 'events.json');
    const eventsData = await fs.readFile(eventsFilePath, 'utf-8');
    events = JSON.parse(eventsData) || [];
  } catch (error) {
    console.error('Error reading events.json:', error.message);
  }
};

initialize().then(() => {
  app.get('/events', async (req, res) => {
    try {
      const eventsPath = path.join(__dirname, 'events.json');
      const eventsData = await fs.readFile(eventsPath, 'utf-8');
      const events = JSON.parse(eventsData);
      res.json(events);
    } catch (error) {
      console.error('Error reading events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // POST endpoint to add a new event

  app.post('/events', async (req, res) => {
    const { date, title } = req.body;
    initialize();

    if (!date || !title) {
      return res.status(400).json({ error: 'Date and title are required.' });
    }

    const newEvent = { date, title };
    events.push(newEvent);

    // Write the entire array back to events.json
    try {
      const eventsFilePath = path.join(__dirname, 'events.json');
      await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing events to events.json:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json(newEvent);
  });

  // Start the server after initialization
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});