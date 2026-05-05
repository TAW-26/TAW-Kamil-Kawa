export default function IconRacket({ size = 20, className = '' }) {
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
      <ellipse cx="9.5" cy="9.5" rx="6.5" ry="7" transform="rotate(-30 9.5 9.5)" />
      <path d="M3.8 6.5 L15.2 12.5" strokeWidth="0.8" />
      <path d="M5.5 4 L13.5 14.8" strokeWidth="0.8" />
      <path d="M2.5 9 L13 16" strokeWidth="0.8" />
      <path d="M2.5 12 L11 17" strokeWidth="0.8" />
      <path d="M14.4 14.5 L21 21" strokeWidth="1.6" />
    </svg>
  );
}
