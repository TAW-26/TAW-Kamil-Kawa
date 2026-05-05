export default function IconStadium({ size = 20, className = '' }) {
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
      <ellipse cx="12" cy="14" rx="9.5" ry="5" />
      <path d="M2.8 13.2 Q12 8 21.2 13.2" />
      <path d="M5.5 11.5 V14" />
      <path d="M9 10.3 V14" />
      <path d="M12 10 V14" />
      <path d="M15 10.3 V14" />
      <path d="M18.5 11.5 V14" />
      <path d="M9 5.5 H15 V8.5 H9 Z" />
      <line x1="12" y1="5.5" x2="12" y2="8.5" strokeWidth="0.8" />
    </svg>
  );
}
