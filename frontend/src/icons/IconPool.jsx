export default function IconPool({ size = 20, className = '' }) {
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
      <path d="M2 16 q2.5 -2 5 0 t5 0 t5 0 t5 0" />
      <path d="M2 19.5 q2.5 -2 5 0 t5 0 t5 0 t5 0" />
      <path d="M6 13 V5.5 a2.2 2.2 0 0 1 4.4 0 V13" />
      <path d="M13.6 13 V5.5 a2.2 2.2 0 0 1 4.4 0 V13" />
      <line x1="6" y1="9" x2="13.6" y2="9" />
    </svg>
  );
}
