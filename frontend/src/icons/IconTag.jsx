export default function IconTag({ size = 16, className = '' }) {
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
      <path d="M2.5 11 L11 2.5 H21.5 V13 L13 21.5 Z" />
      <circle cx="16.5" cy="7.5" r="1.4" />
    </svg>
  );
}
