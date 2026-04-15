import { stops } from '@/data/mockData';

interface TransitMapProps {
  selectedStopId: string;
}

const stopPositions: Record<string, { x: number; y: number }> = {
  'whitefield': { x: 82, y: 18 },
  'koramangala': { x: 62, y: 42 },
  'silk-board': { x: 52, y: 58 },
  'jayanagar': { x: 32, y: 48 },
  'banashankari': { x: 18, y: 66 },
  'majestic': { x: 38, y: 22 },
};

const routes = [
  { from: 'majestic', to: 'jayanagar', color: 'hsl(223, 64%, 53%)', curve: -8 },
  { from: 'jayanagar', to: 'banashankari', color: 'hsl(223, 64%, 53%)', curve: 5 },
  { from: 'jayanagar', to: 'silk-board', color: 'hsl(148, 56%, 44%)', curve: -4 },
  { from: 'silk-board', to: 'koramangala', color: 'hsl(148, 56%, 44%)', curve: 5 },
  { from: 'koramangala', to: 'whitefield', color: 'hsl(33, 78%, 52%)', curve: -10 },
  { from: 'majestic', to: 'koramangala', color: 'hsl(277, 42%, 52%)', curve: 7 },
];

const busMarkers = [
  { x: 46, y: 36, route: '500D' },
  { x: 70, y: 32, route: '201R' },
  { x: 26, y: 56, route: '356' },
];

export function TransitMap({ selectedStopId }: TransitMapProps) {
  const routePaths = routes.map((route, index) => {
    const from = stopPositions[route.from];
    const to = stopPositions[route.to];
    if (!from || !to) {
      return null;
    }

    const cx = (from.x + to.x) / 2;
    const cy = (from.y + to.y) / 2 + route.curve;
    return { key: index, from, to, cx, cy, color: route.color };
  });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60">
        <h2 className="text-xs font-semibold font-heading text-foreground uppercase tracking-wider">Live Boarding View</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Transit sketch over Bengaluru central corridor</p>
      </div>
      <div className="relative px-3 py-4 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--secondary))_0%,transparent_42%),radial-gradient(circle_at_80%_18%,hsl(var(--accent))_0%,transparent_35%),linear-gradient(165deg,hsl(var(--background)),hsl(var(--secondary)/0.3))]">
        <svg viewBox="0 0 100 85" className="w-full h-auto" style={{ minHeight: '170px' }}>
          <defs>
            <linearGradient id="roadFade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="waterTint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(205, 80%, 88%)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="hsl(205, 75%, 80%)" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="100" height="85" fill="hsl(var(--background))" opacity="0.35" rx="4" />
          <path d="M 8 76 C 23 67, 42 65, 66 69 C 82 71, 93 68, 98 64" fill="none" stroke="url(#waterTint)" strokeWidth="8" strokeLinecap="round" />

          <path d="M 7 12 C 24 20, 35 20, 46 15 C 64 8, 76 11, 93 22" fill="none" stroke="url(#roadFade)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 12 28 C 30 34, 42 40, 60 52 C 72 60, 84 64, 95 70" fill="none" stroke="url(#roadFade)" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 18 8 C 21 20, 26 33, 28 46 C 31 58, 34 69, 39 79" fill="none" stroke="url(#roadFade)" strokeWidth="2.4" strokeLinecap="round" />

          {/* Subtle grid */}
          {Array.from({ length: 10 }).map((_, i) =>
            Array.from({ length: 8 }).map((_, j) => (
              <circle key={`${i}-${j}`} cx={i * 11 + 5} cy={j * 11 + 5} r="0.25" fill="hsl(var(--border))" opacity="0.5" />
            ))
          )}

          {/* Transit lines */}
          {routePaths.map((route) => {
            if (!route) return null;
            return (
              <path
                key={route.key}
                d={`M ${route.from.x} ${route.from.y} Q ${route.cx} ${route.cy} ${route.to.x} ${route.to.y}`}
                stroke={route.color}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.68"
              />
            );
          })}

          {/* Bus markers — pill shaped */}
          {busMarkers.map((b, i) => (
            <g key={i}>
              <rect x={b.x - 4} y={b.y - 2.2} width="8" height="4.4" rx="2" fill="hsl(var(--primary))" opacity="0.9" />
              <text x={b.x} y={b.y + 0.8} textAnchor="middle" fontSize="2.4" fill="hsl(var(--primary-foreground))" fontWeight="700" fontFamily="var(--font-heading)">
                {b.route}
              </text>
            </g>
          ))}

          {/* Stop markers */}
          {stops.map((stop) => {
            const pos = stopPositions[stop.id];
            if (!pos) return null;
            const isSelected = stop.id === selectedStopId;
            return (
              <g key={stop.id}>
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="5.5" fill="hsl(var(--board))" opacity="0.12">
                    <animate attributeName="r" values="5.5;7.5;5.5" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.12;0.06;0.12" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={isSelected ? 3.2 : 2}
                  fill={isSelected ? 'hsl(var(--board))' : 'hsl(var(--muted-foreground))'}
                  stroke="hsl(var(--card))"
                  strokeWidth="1.2"
                />
                <text
                  x={pos.x}
                  y={pos.y + (stop.id === 'banashankari' || stop.id === 'silk-board' ? 7.5 : -5.5)}
                  textAnchor="middle"
                  fontSize="2.6"
                  fontWeight={isSelected ? '700' : '500'}
                  fill={isSelected ? 'hsl(var(--board))' : 'hsl(var(--foreground))'}
                  fontFamily="var(--font-heading)"
                  opacity={isSelected ? 1 : 0.7}
                >
                  {stop.shortName}
                </text>
              </g>
            );
          })}

          <g opacity="0.9">
            <rect x="73" y="67" width="21" height="12" rx="2" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <rect x="75" y="70" width="2.5" height="2.5" rx="0.5" fill="hsl(223, 64%, 53%)" />
            <text x="79" y="72" fontSize="2.3" fill="hsl(var(--muted-foreground))" fontWeight="600">Blue</text>
            <rect x="75" y="74" width="2.5" height="2.5" rx="0.5" fill="hsl(148, 56%, 44%)" />
            <text x="79" y="76" fontSize="2.3" fill="hsl(var(--muted-foreground))" fontWeight="600">Green</text>
          </g>
        </svg>

        {/* Legend */}
        <div className="mt-2.5 flex items-center justify-center gap-2.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-board" />
            <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Board</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-wait" />
            <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Wait</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-skip" />
            <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Skip</span>
          </div>
        </div>
      </div>
    </div>
  );
}
