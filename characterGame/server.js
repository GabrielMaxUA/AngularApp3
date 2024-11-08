const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());
console.log('Applying express.json middleware');
app.use(express.json());  

const logFilePath = 'logData.json';

// Endpoint to save log data
app.post('/save-log', (req, res) => {
  const logData = req.body;
  console.log('Received log data:', logData);  // Log incoming data for confirmation

  // Ensure logData is defined
  if (!logData) {
    return res.status(400).json({ message: 'No log data provided' });
  }

  fs.writeFile(logFilePath, JSON.stringify(logData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving log data' });
    }
    res.status(200).json({ message: 'Log data saved successfully' });
  });
});

// Endpoint to load log data
app.get('/load-log', (req, res) => {
  fs.readFile(logFilePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(200).json([]); // Return an empty array if file doesn't exist
      }
      return res.status(500).json({ message: 'Error loading log data' });
    }
    res.status(200).json(JSON.parse(data || '[]'));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
