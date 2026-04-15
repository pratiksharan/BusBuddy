import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { BusApproach } from '@/types';
import { RecommendationBadge } from '@/components/ui/RecommendationBadge';
import { getCrowdLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

interface BusDetailProps {
  bus: BusApproach | null;
  onClose: () => void;
  isMobile: boolean;
  aiExplanation?: string;
  aiExplanationLoading?: boolean;
}

export function BusDetail({
  bus,
  onClose,
  isMobile,
  aiExplanation,
  aiExplanationLoading = false,
}: BusDetailProps) {
  const [showAllReasons, setShowAllReasons] = useState(false);

  if (!bus) return null;

  const actionText = {
    board: 'Get ready to board — move to the door area',
    wait: 'Hold your position — a better option is coming',
    skip: 'Skip this bus — not worth attempting',
  }[bus.recommendation];

  const actionEmoji = {
    board: '🟢',
    wait: '🟡',
    skip: '🔴',
  }[bus.recommendation];

  const topReasons = showAllReasons ? bus.reasons : bus.reasons.slice(0, 2);

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold font-heading text-foreground">{bus.routeNumber}</h3>
            <RecommendationBadge recommendation={bus.recommendation} size="md" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{bus.destination} · {bus.eta} min away</p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 -mr-1 rounded-xl hover:bg-secondary transition-colors active:scale-95">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn(
          'p-3 rounded-xl text-center',
          bus.recommendation === 'board' && 'bg-board-light',
          bus.recommendation === 'wait' && 'bg-wait-light',
          bus.recommendation === 'skip' && 'bg-skip-light',
        )}>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Boarding</p>
          <p className="text-xl font-bold font-heading text-foreground mt-0.5">{bus.boardingChance}%</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/60 text-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Confidence</p>
          <p className="text-xl font-bold font-heading text-foreground mt-0.5">{bus.confidence}%</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/60 text-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Crowd</p>
          <p className={cn(
            'text-sm font-bold font-heading mt-1.5',
            bus.crowdLevel === 'low' && 'text-board',
            bus.crowdLevel === 'moderate' && 'text-wait',
            (bus.crowdLevel === 'high' || bus.crowdLevel === 'packed') && 'text-skip',
          )}>
            {getCrowdLabel(bus.crowdLevel)}
          </p>
        </div>
      </div>

      {/* Action callout */}
      <div className={cn(
        'p-3.5 rounded-xl border',
        bus.recommendation === 'board' && 'bg-board-light border-board/15',
        bus.recommendation === 'wait' && 'bg-wait-light border-wait/15',
        bus.recommendation === 'skip' && 'bg-skip-light border-skip/15',
      )}>
        <p className="text-sm font-medium text-foreground">
          {actionEmoji} {actionText}
        </p>
      </div>

      {/* Reason Factors */}
      <div>
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Reason Factors</h4>
        <div className="space-y-2">
          {topReasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <span className={cn(
                'mt-1.5 w-1.5 h-1.5 rounded-full shrink-0',
                r.impact === 'positive' && 'bg-board',
                r.impact === 'negative' && 'bg-skip',
                r.impact === 'neutral' && 'bg-muted-foreground',
              )} />
              <div>
                <span className="font-semibold text-foreground text-[13px]">{r.label}</span>
                <span className="text-muted-foreground text-[13px]"> — {r.detail}</span>
              </div>
            </div>
          ))}
        </div>
        {bus.reasons.length > 2 && (
          <button
            onClick={() => setShowAllReasons(!showAllReasons)}
            className="flex items-center gap-1 mt-2.5 text-xs text-primary font-semibold hover:underline active:scale-95 transition-transform"
          >
            {showAllReasons ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAllReasons ? 'Show less' : `Show all ${bus.reasons.length} factors`}
          </button>
        )}
      </div>

      {/* AI Explanation */}
      <div className="bg-gradient-to-br from-secondary/80 to-accent/60 rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <h4 className="text-xs font-bold font-heading text-foreground uppercase tracking-wider">AI Explanation</h4>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">Gemini</span>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {aiExplanationLoading ? 'Generating explanation based on current context...' : (aiExplanation ?? bus.aiExplanation)}
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-card-hover border-t border-border max-h-[85vh] overflow-y-auto"
        >
          <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3" />
          <div className="p-5 pb-8">
            {content}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-5">
      {content}
    </div>
  );
}
