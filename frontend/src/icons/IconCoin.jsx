export default function IconCoin({ size = 16, className = '' }) {
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
      <circle cx="12" cy="12" r="6.5" strokeDasharray="1.5 2" strokeWidth="1" />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontFamily="DM Serif Display, serif"
        fontSize="9"
        fill="currentColor"
        stroke="none"
      >
        zł
      </text>
    </svg>
  );
}
