import './LoadingSpinner.css';

export default function LoadingSpinner({ text = 'Wczytywanie' }) {
  return (
    <div className="press-loader" role="status" aria-live="polite">
      <span className="press-loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="press-loader-text">{text}</span>
    </div>
  );
}
