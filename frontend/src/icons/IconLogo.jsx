export default function IconLogo({ size = 32, className = '' }) {
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
      <circle cx="16" cy="16" r="14.2" />
      <circle cx="16" cy="16" r="11.5" strokeDasharray="1 2" strokeWidth="1" />
      <text
        x="16"
        y="20.4"
        textAnchor="middle"
        fontFamily="DM Serif Display, serif"
        fontSize="13"
        fill="currentColor"
        stroke="none"
      >
        RS
      </text>
    </svg>
  );
}
