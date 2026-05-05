export default function IconLock({ size = 20, className = '' }) {
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
      <rect x="4.5" y="10.5" width="15" height="10.5" />
      <path d="M7.5 10.5 V7 a4.5 4.5 0 0 1 9 0 V10.5" />
      <circle cx="12" cy="15.5" r="1.2" />
      <line x1="12" y1="16.7" x2="12" y2="18.5" />
    </svg>
  );
}
