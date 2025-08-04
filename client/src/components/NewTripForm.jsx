import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewTripForm.css';

function NewTripForm({ onSubmit }) {
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    title: '',
    description: '',
    passengers: '',
    startDate: '',
    endDate: '',
    nights: 0,
    days: 0,
    price: '',
    carRental: false,
    cityImages: ['', '', '', '', ''],
    hotelImages: ['', '', '', '', ''],
    flightDetails: {
      flights: [
        { date: '', airline: '', departure: '', arrival: '', baggageIncluded: false, baggageWeight: '' },
        { date: '', airline: '', departure: '', arrival: '', baggageIncluded: false, baggageWeight: '' }
      ]
    },
    hotel: {
      name: '',
      rating: '',
      distance: '',
      note: ''
    },
    carDetails: {
      company: '',
      description: '',
      rentalDays: ''
    }
  });

  useEffect(() => {
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      if (start <= end) {
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setTrip(prev => ({ ...prev, nights, days: nights + 1 }));
      }
    }
  }, [trip.startDate, trip.endDate]);

  const handleChange = (e, path) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTrip(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let target = updated;
      while (keys.length > 1) target = target[keys.shift()];
      target[keys[0]] = value;
      return updated;
    });
  };

  const handleImageLinkChange = (e, index, type) => {
    const value = e.target.value;
    setTrip(prev => {
      const updated = { ...prev };
      updated[type][index] = value;
      return updated;
    });
  };

  const fillWithRandomData = () => {
    const randomDate = (daysFromNow) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    };
    const randomImg = () => `https://picsum.photos/seed/${Math.random().toString(36).substring(2, 8)}/600/400`;

    const start = randomDate(3);
    const end = randomDate(7);

    const randomTrip = {
      title: 'חופשה בברצלונה',
      description: 'סיורים מודרכים, ים, אוכל טוב ואווירה ים תיכונית',
      passengers: '2',
      startDate: start,
      endDate: end,
      nights: 4,
      days: 5,
      price: '4870',
      carRental: true,
      cityImages: Array(5).fill().map(() => randomImg()),
      hotelImages: Array(5).fill().map(() => randomImg()),
      flightDetails: {
        flights: [
          {
            date: start,
            airline: 'El Al',
            departure: '10:30',
            arrival: '13:45',
            baggageIncluded: true,
            baggageWeight: '23'
          },
          {
            date: end,
            airline: 'El Al',
            departure: '20:00',
            arrival: '23:15',
            baggageIncluded: true,
            baggageWeight: '23'
          }
        ]
      },
      hotel: {
        name: 'Hotel Barcelona Central',
        rating: '9.1',
        distance: '1.0',
        note: 'כולל ארוחת בוקר'
      },
      carDetails: {
        company: 'Europcar',
        description: 'רכב משפחתי אוטומטי',
        rentalDays: '5'
      }
    };

    setTrip(randomTrip);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip.title || !trip.startDate || !trip.endDate) {
      alert('נא למלא את כל השדות החיוניים.');
      return;
    }
    onSubmit(trip);
    alert('הטיול התווסף בהצלחה!');
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form" dir="rtl">
      <h2>יצירת טיול חדש</h2>
      <button type="button" onClick={fillWithRandomData}>מלא אוטומטית</button>

      <label>שם הטיול:
        <input type="text" value={trip.title} onChange={e => handleChange(e, 'title')} />
      </label>

      <label>תיאור:
        <textarea value={trip.description} onChange={e => handleChange(e, 'description')} rows={3} />
      </label>

      <label>מספר נוסעים:
        <input type="number" value={trip.passengers} onChange={e => handleChange(e, 'passengers')} />
      </label>

      <label>תאריך התחלה:
        <input type="date" value={trip.startDate} onChange={e => handleChange(e, 'startDate')} />
      </label>

      <label>תאריך סיום:
        <input type="date" value={trip.endDate} min={trip.startDate} onChange={e => handleChange(e, 'endDate')} />
      </label>

      <label>מחיר:
        <input type="number" value={trip.price} onChange={e => handleChange(e, 'price')} />
      </label>

      <label>
        <input type="checkbox" checked={trip.carRental} onChange={e => handleChange(e, 'carRental')} />
        כולל רכב שכור
      </label>

      {trip.carRental && (
        <>
          <label>חברת השכרה:
            <input type="text" value={trip.carDetails.company} onChange={e => handleChange(e, 'carDetails.company')} />
          </label>

          <label>פרטי הרכב:
            <input type="text" value={trip.carDetails.description} onChange={e => handleChange(e, 'carDetails.description')} />
          </label>

          <label>מספר ימי השכרה:
            <input type="number" value={trip.carDetails.rentalDays} onChange={e => handleChange(e, 'carDetails.rentalDays')} />
          </label>
        </>
      )}

      <h3>קישורי תמונות יעד (5):</h3>
      {trip.cityImages.map((link, i) => (
        <input key={i} type="text" value={link} placeholder={`תמונה ${i + 1}`} onChange={e => handleImageLinkChange(e, i, 'cityImages')} />
      ))}

      <h3>קישורי תמונות מלון (5):</h3>
      {trip.hotelImages.map((link, i) => (
        <input key={i} type="text" value={link} placeholder={`תמונת מלון ${i + 1}`} onChange={e => handleImageLinkChange(e, i, 'hotelImages')} />
      ))}

      <h3>טיסות</h3>
      {['הלוך', 'חזור'].map((label, i) => (
        <fieldset key={i}>
          <legend>טיסת {label}</legend>
          <label>תאריך:
            <input type="date" value={trip.flightDetails.flights[i].date} min={trip.startDate} max={trip.endDate}
              onChange={e => handleChange(e, `flightDetails.flights.${i}.date`)} />
          </label>
          <label>חברת תעופה:
            <input type="text" value={trip.flightDetails.flights[i].airline} onChange={e => handleChange(e, `flightDetails.flights.${i}.airline`)} />
          </label>
          <label>שעת המראה:
            <input type="time" value={trip.flightDetails.flights[i].departure} onChange={e => handleChange(e, `flightDetails.flights.${i}.departure`)} />
          </label>
          <label>שעת נחיתה:
            <input type="time" value={trip.flightDetails.flights[i].arrival} onChange={e => handleChange(e, `flightDetails.flights.${i}.arrival`)} />
          </label>
          <label>
            <input type="checkbox" checked={trip.flightDetails.flights[i].baggageIncluded}
              onChange={e => handleChange(e, `flightDetails.flights.${i}.baggageIncluded`)} /> כולל כבודה
          </label>
          {trip.flightDetails.flights[i].baggageIncluded && (
            <label>משקל כבודה בק"ג:
              <input type="number" value={trip.flightDetails.flights[i].baggageWeight}
                onChange={e => handleChange(e, `flightDetails.flights.${i}.baggageWeight`)} />
            </label>
          )}
        </fieldset>
      ))}

      <h3>פרטי מלון</h3>
      <label>שם:
        <input type="text" value={trip.hotel.name} onChange={e => handleChange(e, 'hotel.name')} />
      </label>
      <label>דירוג Booking:
        <input type="number" step="0.1" value={trip.hotel.rating} onChange={e => handleChange(e, 'hotel.rating')} />
      </label>
      <label>מרחק מהמרכז (ק"מ):
        <input type="number" step="0.1" value={trip.hotel.distance} onChange={e => handleChange(e, 'hotel.distance')} />
      </label>
      <label>הערה:
        <input type="text" value={trip.hotel.note} onChange={e => handleChange(e, 'hotel.note')} />
      </label>

      <button type="submit">שמור טיול</button>
    </form>
  );
}

export default NewTripForm;
