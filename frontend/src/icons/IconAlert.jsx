export default function IconAlert({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.8 L22 20.5 L2 20.5 Z" />
      <line x1="12" y1="9.5" x2="12" y2="14.5" strokeWidth="2" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
