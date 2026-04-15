import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { AppFilters, BusApproach } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askBusBuddy } from '@/services/aiExplanation';
import { GEMINI_MODEL_NAME, isFirebaseConfigured } from '@/services/firebase';

interface AskBusBuddyPanelProps {
  filters: AppFilters;
  buses: BusApproach[];
  selectedBus: BusApproach | null;
  scenarioId: string;
}

export function AskBusBuddyPanel({
  filters,
  buses,
  selectedBus,
  scenarioId,
}: AskBusBuddyPanelProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    'Which bus is best now?',
    'Why is this bus marked skip?',
    'Should I wait here?',
  ];

  const promptHint = useMemo(() => {
    return selectedBus
      ? `Try: Why is ${selectedBus.routeNumber} marked ${selectedBus.recommendation}?`
      : 'Try: Which bus is best for boarding now?';
  }, [selectedBus]);

  const onAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await askBusBuddy({
        question: trimmed,
        filters,
        buses,
        selectedBus,
        scenarioId,
      });
      setAnswer(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="text-xs font-semibold font-heading text-foreground uppercase tracking-wider">Ask BusBuddy AI</h2>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
          Provider: Firebase AI Logic
        </span>
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground/80">
          Model: {GEMINI_MODEL_NAME}
        </span>
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground/80">
          API: {isFirebaseConfigured ? 'Live Gemini API' : 'Fallback Mode'}
        </span>
      </div>

      <Textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder={promptHint}
        className="min-h-[72px] text-sm"
        maxLength={220}
      />

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => setQuestion(item)}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">Ask anything about your current boarding choices in BusBuddy.</p>
        <Button size="sm" onClick={onAsk} disabled={isLoading || question.trim().length === 0}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </Button>
      </div>

      {answer && (
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <p className="text-[13px] text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
