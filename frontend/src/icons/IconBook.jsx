export default function IconBook({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6.5 H14 a2 2 0 0 1 2 2 V27 a2 2 0 0 0 -2 -2 H4 Z" />
      <path d="M28 6.5 H18 a2 2 0 0 0 -2 2 V27 a2 2 0 0 1 2 -2 H28 Z" />
      <line x1="6.5" y1="11" x2="13" y2="11" strokeWidth="0.8" />
      <line x1="6.5" y1="14" x2="13" y2="14" strokeWidth="0.8" />
      <line x1="6.5" y1="17" x2="11" y2="17" strokeWidth="0.8" />
      <line x1="19" y1="11" x2="25.5" y2="11" strokeWidth="0.8" />
      <line x1="19" y1="14" x2="25.5" y2="14" strokeWidth="0.8" />
      <line x1="19" y1="17" x2="23" y2="17" strokeWidth="0.8" />
    </svg>
  );
}
