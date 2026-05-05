export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="25" y="20" width="22" height="60" fill="#0052FF" />
      <polygon points="52,20 85,20 52,50" fill="#0052FF" />
      <polygon points="52,50 85,80 52,80" fill="#0052FF" />
      <circle cx="50" cy="50" r="14" fill="#88B4FF" fillOpacity="0.9" />
    </svg>
  );
}
