export default function IconCourt({ size = 20, className = '' }) {
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
      <rect x="2.5" y="5" width="19" height="14" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <circle cx="12" cy="12" r="2.4" />
      <rect x="2.5" y="9" width="3.5" height="6" />
      <rect x="18" y="9" width="3.5" height="6" />
    </svg>
  );
}
