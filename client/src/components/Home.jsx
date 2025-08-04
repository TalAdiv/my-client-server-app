import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch('/api/trips');
        if (!res.ok) throw new Error('Failed to fetch trips');
        const data = await res.json();
        setTrips(data);
      } catch (error) {
        console.error('שגיאה בטעינת הטיולים:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) return <p>טוען טיולים...</p>;
  if (trips.length === 0) return <p>עדיין אין טיולים.</p>;

  return (
    <div className="offers" dir="rtl">
      {trips.map(trip => (
        <Link
          to={`/trip/${trip.id}`}
          key={trip.id}
          className="card"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {/* הוספת תמונה ראשית אם קיימת */}
          {trip.cityImages && trip.cityImages.length > 0 && (
            <img
              src={trip.cityImages[0]}
              alt={trip.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '8px',
                objectFit: 'cover'
              }}
            />
          )}

          <h3>{trip.title}</h3>
          <p>{trip.description?.slice(0, 100) || 'אין תיאור'}</p>
          <p>מחיר: {trip.price} ₪</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;
