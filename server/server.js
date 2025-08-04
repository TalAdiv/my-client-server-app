const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// פונקציה לקריאת הנתונים מהקובץ
const readTripsFromFile = () => {
    if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

// פונקציה לכתיבת הנתונים לקובץ
const writeTripsToFile = (trips) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(trips, null, 2), 'utf8');
};

// Route לקבלת כל הטיולים
app.get('/api/trips', (req, res) => {
    const trips = readTripsFromFile();
    res.json(trips);
});

// Route ליצירת טיול חדש
app.post('/api/trips', (req, res) => {
    const trips = readTripsFromFile();
    const newTrip = { ...req.body, id: Date.now().toString() };
    trips.push(newTrip);
    writeTripsToFile(trips);
    res.status(201).json(newTrip);
});

// Route למחיקת טיול
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

// קבצים סטטיים של הריאקט
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// כל בקשה שלא תואמת אף אחד מה-API routes, תוגש על ידי הריאקט
app.get('/*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});


// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});