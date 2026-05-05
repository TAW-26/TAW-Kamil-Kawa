export default function IconPin({ size = 16, className = '' }) {
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
      <path d="M12 22 C7 16 4.5 12.8 4.5 9.2 a7.5 7.5 0 0 1 15 0 C19.5 12.8 17 16 12 22 Z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </svg>
  );
}
