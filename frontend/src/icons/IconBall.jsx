export default function IconBall({ size = 20, className = '' }) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 2.5 L12 6.5 L8.5 9 L9.8 13 L12 12 L14.2 13 L15.5 9 L12 6.5 Z" />
      <path d="M9.8 13 L7 16 L8.8 19.5" />
      <path d="M14.2 13 L17 16 L15.2 19.5" />
      <path d="M3.2 10 L8.5 9" />
      <path d="M20.8 10 L15.5 9" />
    </svg>
  );
}
