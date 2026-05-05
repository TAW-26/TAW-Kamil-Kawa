import Icon from '../icons/Icon';
import './EmptyState.css';

export default function EmptyState({ icon = 'book', title, message }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon name={icon} size={48} />
      </span>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      <span className="empty-state-rule" aria-hidden="true" />
    </div>
  );
}
