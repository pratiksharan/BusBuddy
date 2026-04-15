import type { Recommendation } from '@/types';
import { getRecommendationLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  size?: 'sm' | 'md' | 'lg';
}

export function RecommendationBadge({ recommendation, size = 'md' }: RecommendationBadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-extrabold rounded-xl uppercase tracking-[0.14em] border',
        sizeClasses[size],
        recommendation === 'board' && 'bg-board/20 text-board border-board/35',
        recommendation === 'wait' && 'bg-wait/20 text-wait border-wait/35',
        recommendation === 'skip' && 'bg-skip/20 text-skip border-skip/35',
      )}
    >
      {getRecommendationLabel(recommendation)}
    </span>
  );
}
