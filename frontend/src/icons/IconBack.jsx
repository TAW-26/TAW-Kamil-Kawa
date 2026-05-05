export default function IconBack({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
      <polyline points="9.5 6 3.5 12 9.5 18" />
    </svg>
  );
}
