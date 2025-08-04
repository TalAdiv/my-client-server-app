import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewTripForm from '../components/NewTripForm';

function CreateTripPage() {
  const navigate = useNavigate();

  const handleNewTrip = async (tripData) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      if (!res.ok) throw new Error('Failed to add trip');
      await res.json();
      alert('הטיול נוסף בהצלחה!');
      navigate('/');
    } catch (error) {
      console.error('שגיאה ביצירת טיול:', error);
      alert('אירעה שגיאה בעת הוספת הטיול.');
    }
  };

  return (
    <div className="page" dir="rtl">
      <h1>יצירת טיול חדש</h1>
      <NewTripForm onSubmit={handleNewTrip} />
    </div>
  );
}

export default CreateTripPage;
