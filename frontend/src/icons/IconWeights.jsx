export default function IconWeights({ size = 20, className = '' }) {
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
      <rect x="2" y="9" width="2.5" height="6" />
      <rect x="5" y="7" width="2" height="10" />
      <rect x="17" y="7" width="2" height="10" />
      <rect x="19.5" y="9" width="2.5" height="6" />
      <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2" />
    </svg>
  );
}
