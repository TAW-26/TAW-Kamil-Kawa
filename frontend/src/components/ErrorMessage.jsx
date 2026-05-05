import Icon from '../icons/Icon';
import './ErrorMessage.css';

export default function ErrorMessage({ message = 'Wystąpił błąd.', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-state-icon">
        <Icon name="alert" size={36} />
      </span>
      <h3 className="error-state-title">Coś poszło nie tak</h3>
      <p className="error-state-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline">
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
