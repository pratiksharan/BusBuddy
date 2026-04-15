import { ArrowRight, Sparkles } from 'lucide-react';
import type { BusApproach } from '@/types';
import { RecommendationBadge } from '@/components/ui/RecommendationBadge';

interface TopRecommendationCardProps {
  bus: BusApproach;
  summary?: string;
  onSelect: (id: string) => void;
}

export function TopRecommendationCard({ bus, summary, onSelect }: TopRecommendationCardProps) {
  return (
    <button
      onClick={() => onSelect(bus.id)}
      className="w-full rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/10 via-card to-card px-4 pt-4 pb-3 text-left shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Top Recommendation
        </div>
        <span className="text-[10px] text-muted-foreground">Best now</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold font-heading text-foreground leading-none">{bus.routeNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground truncate">{bus.destination}</p>
        </div>
        <RecommendationBadge recommendation={bus.recommendation} size="md" />
      </div>

      <p className="mt-2.5 text-[13px] text-foreground/85 leading-relaxed">
        {summary ?? bus.reasons[0]?.detail ?? 'Best balance of crowd, ETA, and boarding chance right now.'}
      </p>

      <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
        View details <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
