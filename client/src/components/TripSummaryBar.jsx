// components/TripSummaryBar.js
import './TripSummaryBar.css';


function TripSummaryBar({ trip }) {
  if (!trip) return null;

  return (
    <div className="trip-summary-bar">
      <strong>{trip.name}</strong> | {trip.date} | {trip.destination}
    </div>
  );
}

export default TripSummaryBar;
