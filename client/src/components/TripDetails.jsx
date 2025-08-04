import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import takeoffIcon from '../assets/takeoff.png';
import landingIcon from '../assets/landing.png';
import hotelIcon from '../assets/hotel.png';
import carIcon from '../assets/car.png';
import sumIcon from '../assets/sum.png';

function getDayName(dateString) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const date = new Date(dateString);
  return days[date.getDay()];
}

function TripDetails({ trips, onDeleteTrip }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [modalSrc, setModalSrc] = useState(null);

  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [contactData, setContactData] = useState({
    email: '',
    passengers: '',
    phone: '',
    notes: '',
  });

  const trip = trips.find(t => String(t.id) === tripId);
  if (!trip) return <h2>הטיול לא נמצא</h2>;

  const openModal = (src) => setModalSrc(src);
  const closeModal = (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
      setModalSrc(null);
    }
  };

  // מחיקה דרך API ולא רק סטייט
  const handleDeleteClick = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הטיול?')) {
      try {
        const res = await fetch(`http://localhost:4000/api/trips/${trip.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('מחיקה נכשלה');

        alert('הטיול נמחק בהצלחה');
        if (onDeleteTrip) onDeleteTrip(trip.id);  // מעדכן סטייט במערכת אם יש
        navigate('/');
      } catch (error) {
        alert('אירעה שגיאה במחיקת הטיול. נסה שנית.');
        console.error(error);
      }
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      setContactData(prev => ({ ...prev, phone: cleaned }));
    } else {
      setContactData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (
      !contactData.email ||
      !contactData.phone ||
      contactData.phone.length < 9 ||
      !contactData.passengers
    ) {
      alert('אנא מלא את כל השדות החיוניים: מייל, טלפון עם לפחות 9 ספרות ומספר נוסעים.');
      return;
    }

    const templateParams = {
      email: contactData.email,
      phone: contactData.phone,
      passengers: contactData.passengers,
      notes: contactData.notes || 'אין הערות',
      tripTitle: trip.title,
      tripDates: `${trip.startDate} - ${trip.endDate}`,
      tripNights: trip.nights,
      tripDays: trip.days,
      tripFlightGoDate: trip.flightDetails.flights[0].date,
      tripFlightGoHours: `${trip.flightDetails.flights[0].departure}–${trip.flightDetails.flights[0].arrival}`,
      tripFlightBackDate: trip.flightDetails.flights[1].date,
      tripFlightBackHours: `${trip.flightDetails.flights[1].departure}–${trip.flightDetails.flights[1].arrival}`,
      hotelName: trip.hotel.name,
      hotelRating: trip.hotel.rating,
      hotelDistance: trip.hotel.distance,
      hotelNote: trip.hotel.note,
      carRental: trip.carRental ? 'כן' : 'לא',
      carCompany: trip.carDetails?.company || '-',
      carDescription: trip.carDetails?.description || '-',
      carRentalDays: trip.carDetails?.rentalDays || '-',
      price: trip.price,
    };

    emailjs
      .send('service_aahk7m6', 'template_hgcpobq', templateParams, 'DozbVqJBql2vyXUv3')
      .then(() => {
        alert('הבקשה נשלחה בהצלחה! נחזור אליך בהקדם.');
        setContactFormOpen(false);
        setContactData({ email: '', passengers: '', phone: '', notes: '' });
      })
      .catch((error) => {
        console.error('שליחת המייל נכשלה:', error);
        alert('שליחה נכשלה. נסה שוב.');
      });
  };

  const validCityImages = (trip.cityImages || []).filter(src => src?.trim());
  const validHotelImages = (trip.hotelImages || []).filter(src => src?.trim());

  return (
    <div className="trip-details-container">
      <div className="trip-summary-bar">
        {trip.title}, {trip.nights} לילות {trip.days} ימים, {' '}
        {`${getDayName(trip.startDate)}–${getDayName(trip.endDate)}, `}
        {trip.startDate}–{trip.endDate}
      </div>

      <div className="section-box">
        <div className="image-grid-rows">
          {validCityImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`תמונה ${i + 1}`}
              className="destination-image"
              onClick={() => openModal(src)}
            />
          ))}
        </div>
      </div>

      <div className="section-box">
        <div className="flight-row">
          <div className="flight-card">
            <div className="icon-container" id="icon-flight-go">
              <img src={takeoffIcon} alt="אייקון טיסת הלוך" />
            </div>
            <ul className="info-list-flight">
              <li>
                <strong>תאריך:</strong> {trip.flightDetails.flights[0].date} ({getDayName(trip.flightDetails.flights[0].date)})
              </li>
              <li>
                <strong>שעות:</strong> {trip.flightDetails.flights[0].departure}–{trip.flightDetails.flights[0].arrival}
              </li>
              <li>
                <strong>חברת תעופה:</strong> {trip.flightDetails.flights[0].airline}
              </li>
              <li>
                <strong>כבודה:</strong> {trip.flightDetails.flights[0].baggageIncluded
                  ? `${trip.flightDetails.flights[0].baggageWeight} ק"ג`
                  : 'לא כולל כבודה'}
              </li>
              {trip.flightDetails.flights[0].note && <li>{trip.flightDetails.flights[0].note}</li>}
            </ul>
          </div>

          <div className="flight-card">
            <div className="icon-container" id="icon-flight-back">
              <img src={landingIcon} alt="אייקון טיסת חזור" />
            </div>
            <ul className="info-list-flight">
              <li>
                <strong>תאריך:</strong> {trip.flightDetails.flights[1].date} ({getDayName(trip.flightDetails.flights[1].date)})
              </li>
              <li>
                <strong>שעות:</strong> {trip.flightDetails.flights[1].departure}–{trip.flightDetails.flights[1].arrival}
              </li>
              <li>
                <strong>חברת תעופה:</strong> {trip.flightDetails.flights[1].airline}
              </li>
              <li>
                <strong>כבודה:</strong> {trip.flightDetails.flights[1].baggageIncluded
                  ? `${trip.flightDetails.flights[1].baggageWeight} ק"ג`
                  : 'לא כולל כבודה'}
              </li>
              {trip.flightDetails.flights[1].note && <li>{trip.flightDetails.flights[1].note}</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="image-grid-rows">
          {validHotelImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`מלון ${i + 1}`}
              className="hotel-image"
              onClick={() => openModal(src)}
            />
          ))}
        </div>
      </div>

      <div className="section-row">
        <div className="section-box1">
          <div className="icon-container" id="icon-hotel">
            <img src={hotelIcon} alt="אייקון מלון" />
          </div>
          <ul className="info-list">
            <li><strong>שם המלון:</strong> {trip.hotel.name}</li>
            <li><strong>דירוג בוקינג:</strong> {trip.hotel.rating}</li>
            <li><strong>מרחק מהמרכז:</strong> {trip.hotel.distance} ק"מ</li>
            <li><strong>הערה:</strong> {trip.hotel.note}</li>
          </ul>
        </div>

        <div className="section-box1">
          <div className="icon-container" id="icon-car">
            <img src={carIcon} alt="אייקון רכב" />
          </div>
          <div className="car-info">
            {trip.carRental ? (
              <>
                <p><strong>השכרת רכב:</strong> כן</p>
                <p><strong>חברה:</strong> {trip.carDetails?.company || 'לא צוינה'}</p>
                <p><strong>פרטים:</strong> {trip.carDetails?.description || 'אין'}</p>
                <p><strong>מס' ימים:</strong> {trip.carDetails?.rentalDays || '?'}</p>
              </>
            ) : (
              <p><strong>השכרת רכב:</strong> לא</p>
            )}
          </div>
        </div>
      </div>

      <div className="section-box2">
        <div className="icon-container" id="icon-sum">
          <img src={sumIcon} alt="אייקון סיכום" />
        </div>
        <p className="price"><strong>סה"כ לתשלום:</strong> {trip.price} ₪</p>
      </div>

      <button
        className="contact-button"
        onClick={() => setContactFormOpen(prev => !prev)}
        style={{ marginTop: '20px' }}
      >
        {contactFormOpen ? 'סגור טופס בקשה' : 'אני מעוניין, חזרו אליי'}
      </button>

      {contactFormOpen && (
        <form
          className="contact-form"
          onSubmit={handleContactSubmit}
          style={{ marginTop: '10px', maxWidth: '400px' }}
        >
          <label>
            שם מלא:
            <input
              type="text"
              name="name"
              value={contactData.name}
              onChange={handleContactChange}
              required
            />
          </label>

          <label>
            מייל:
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleContactChange}
              required
              dir="ltr"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="כתובת מייל חוקית לדוגמה: name@example.com"
              style={{ width: '100%', padding: '8px', fontSize: '1em' }}
            />
          </label>

          <label>
            מספר נוסעים:
            <input
              type="number"
              name="passengers"
              value={contactData.passengers}
              onChange={handleContactChange}
              min="1"
              required
              dir="ltr"
              style={{ width: '100%', padding: '8px', fontSize: '1em' }}
            />
          </label>

          <label>
            טלפון:
            <input
              type="text"
              name="phone"
              value={contactData.phone}
              onChange={handleContactChange}
              required
              dir="ltr"
              inputMode="numeric"
              pattern="\d{9,}"
              title="יש להזין מספר טלפון עם לפחות 9 ספרות"
              style={{ width: '100%', padding: '8px', fontSize: '1em' }}
            />
          </label>

          <label>
            הערות:
            <textarea
              name="notes"
              value={contactData.notes}
              onChange={handleContactChange}
              rows={3}
              style={{ width: '100%', padding: '8px', fontSize: '1em' }}
            />
          </label>

          <button type="submit" style={{ marginTop: '10px' }}>
            שלח בקשה
          </button>
        </form>
      )}

      {modalSrc && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img src={modalSrc} className="modal-content" alt="תמונה מוגדלת" />
        </div>
      )}

      {onDeleteTrip && (
        <button className="delete-button" onClick={handleDeleteClick}>
          מחיקת טיול
        </button>
      )}
    </div>
  );
}

export default TripDetails;
