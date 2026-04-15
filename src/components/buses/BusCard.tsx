import { Clock, Users, TrendingUp, Shield } from 'lucide-react';
import type { BusApproach } from '@/types';
import { RecommendationBadge } from '@/components/ui/RecommendationBadge';
import { getCrowdLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

interface BusCardProps {
  bus: BusApproach;
  isSelected: boolean;
  onSelect: (id: string) => void;
  summary?: string;
  summaryLoading?: boolean;
}

export function BusCard({ bus, isSelected, onSelect, summary, summaryLoading = false }: BusCardProps) {
  return (
    <button
      onClick={() => onSelect(bus.id)}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all duration-150',
        isSelected
          ? 'bg-primary/5 border-primary shadow-card-hover ring-2 ring-primary/35 scale-[1.01]'
          : 'bg-card border-border shadow-card hover:shadow-card-hover active:scale-[0.98]'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl font-extrabold font-heading text-foreground leading-none tracking-tight">{bus.routeNumber}</span>
          <RecommendationBadge recommendation={bus.recommendation} size="sm" />
          {isSelected && (
            <span className="rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              Selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-foreground shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground/85" />
          <span className="text-sm font-semibold font-heading text-foreground/90">{bus.eta} min</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-1 truncate">{bus.destination}</p>

      <p className="text-[11px] text-foreground/80 mt-2 leading-snug min-h-[30px]">
        {summaryLoading ? 'Generating a quick AI note...' : (summary ?? 'Tap to see detailed recommendation context.')}
      </p>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-muted-foreground/80" />
          <span className={cn(
            'text-[11px] font-medium',
            bus.crowdLevel === 'low' && 'text-board',
            bus.crowdLevel === 'moderate' && 'text-wait',
            (bus.crowdLevel === 'high' || bus.crowdLevel === 'packed') && 'text-skip',
          )}>
            {getCrowdLabel(bus.crowdLevel)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/80" />
          <span className="text-[11px] font-medium text-foreground/85">{bus.boardingChance}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-muted-foreground/80" />
          <span className="text-[11px] font-medium text-muted-foreground">{bus.confidence}%</span>
        </div>
      </div>
    </button>
  );
}
