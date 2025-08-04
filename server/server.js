const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes – API
const readTripsFromFile = () => {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

const writeTripsToFile = (trips) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(trips, null, 2), 'utf8');
};

app.get('/api/trips', (req, res) => {
  const trips = readTripsFromFile();
  res.json(trips);
});

app.post('/api/trips', (req, res) => {
  const trips = readTripsFromFile();
  const newTrip = { ...req.body, id: Date.now().toString() };
  trips.push(newTrip);
  writeTripsToFile(trips);
  res.status(201).json(newTrip);
});

app.delete('/api/trips/:id', (req, res) => {
  let trips = readTripsFromFile();
  const tripId = req.params.id;
  const initialLength = trips.length;
  trips = trips.filter(t => t.id !== tripId);
  if (trips.length < initialLength) {
    writeTripsToFile(trips);
    res.status(200).json({ message: `Trip with id ${tripId} deleted.` });
  } else {
    res.status(404).json({ message: `Trip with id ${tripId} not found.` });
  }
});

// Static files - React
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
