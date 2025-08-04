import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DeleteTripPage({ onDeleteTrip }) {
  const { tripId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tripId) {
      onDeleteTrip(Number(tripId));
      navigate('/');
    }
  }, [tripId, onDeleteTrip, navigate]);

  return <h2>מחיקת טיול...</h2>;
}

export default DeleteTripPage;