import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import CreateTripPage from './pages/CreateTripPage';
import TripDetails from './components/TripDetails';
import TripSummaryBar from './components/TripSummaryBar';

import './style.css';

function App() {
  const [trips, setTrips] = useState([]);
  const [tripToShow, setTripToShow] = useState(null);

  //--- טעינת הטיולים מהשרת בעת טעינת האפליקציה ---
  useEffect(() => {
    // השתמש בנתיב יחסי - ה-proxy יפנה את זה לפורט 5000
    fetch('/api/trips')
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(console.error);
  }, []);

  //--- טיפול ביצירת טיול חדש ---
  const handleNewTrip = useCallback((newTripData) => {
    fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTripData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add trip');
        return res.json();
      })
      .then(addedTrip => {
        setTrips(prev => [...prev, addedTrip]);
        setTripToShow(addedTrip);
      })
      .catch(console.error);
  }, []);

  //--- טיפול במחיקת טיול קיים ---
  const handleDeleteTrip = useCallback((tripIdToDelete) => {
    fetch(`/api/trips/${tripIdToDelete}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete trip');
        setTrips(prev => prev.filter(trip => trip.id !== tripIdToDelete));
        if (tripToShow?.id === tripIdToDelete) {
          setTripToShow(null);
        }
      })
      .catch(console.error);
  }, [tripToShow]);

  return (
    <Router>
      <div className="header-stub"></div>
      <Header />

      {tripToShow && <TripSummaryBar trip={tripToShow} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home trips={trips} />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trip/:tripId" element={<TripDetails trips={trips} onDeleteTrip={handleDeleteTrip} />} />

          {process.env.NODE_ENV === 'development' && (
            <>
              <Route path="/create" element={<CreateTripPage onNewTrip={handleNewTrip} />} />
              <Route
                path="/delete/:tripId"
                element={<TripDetails trips={trips} onDeleteTrip={handleDeleteTrip} />}
              />
            </>
          )}
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;