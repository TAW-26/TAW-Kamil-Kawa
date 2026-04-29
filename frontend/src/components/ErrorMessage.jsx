import './ErrorMessage.css';

export default function ErrorMessage({ message = 'Wystąpił błąd.', onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">&#9888;</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
