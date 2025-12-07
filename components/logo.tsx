export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer frame with gradient lines */}
        <path
          d="M20 20L50 10L80 20L90 50L80 80L50 90L20 80L10 50L20 20Z"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
        />
        {/* Inner frame */}
        <path
          d="M30 30L50 25L70 30L75 50L70 70L50 75L30 70L25 50L30 30Z"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
        />
        {/* Connection dots */}
        <circle cx="20" cy="20" r="4" fill="#a855f7" />
        <circle cx="50" cy="10" r="3" fill="#22c55e" />
        <circle cx="80" cy="20" r="4" fill="#22c55e" />
        <circle cx="90" cy="50" r="3" fill="#a855f7" />
        <circle cx="80" cy="80" r="4" fill="#22c55e" />
        <circle cx="50" cy="90" r="3" fill="#a855f7" />
        <circle cx="20" cy="80" r="4" fill="#22c55e" />
        <circle cx="10" cy="50" r="3" fill="#a855f7" />
        {/* Center R */}
        <text x="50" y="55" textAnchor="middle" fill="#a855f7" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
          R
        </text>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-secondary">R</span>
          <span className="text-primary">P</span>
        </span>
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Concepts to Creations</span>
      </div>
    </div>
  )
}
