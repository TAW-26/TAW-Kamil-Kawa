import './LoadingSpinner.css';

export default function LoadingSpinner({ text = 'Ładowanie...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
