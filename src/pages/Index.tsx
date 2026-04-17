import { useEffect, useMemo, useState } from 'react';
import { MonitorSmartphone, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TransitMap } from '@/components/map/TransitMap';
import { ScenariosPanel } from '@/components/selectors/ScenariosPanel';
import { BusList } from '@/components/buses/BusList';
import { TopRecommendationCard } from '@/components/buses/TopRecommendationCard';
import { BusDetail } from '@/components/detail/BusDetail';
import { AskBusBuddyPanel } from '@/components/assistant/AskBusBuddyPanel';
import { useAppState } from '@/hooks/useAppState';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  getBusCardDescriptions,
  getSelectedBusExplanation,
  recommendationSummary,
} from '@/services/aiExplanation';
import { cn } from '@/lib/utils';

const MOBILE_VIEW_TIP_KEY = 'busbuddy-mobile-view-tip-seen';

export default function Index() {
  const {
    filters,
    buses,
    selectedBus,
    selectedBusId,
    activeScenarioId,
    setSelectedBusId,
    updateFilter,
    applyScenario,
  } = useAppState();

  const isMobile = useIsMobile();
  const [cardSummaries, setCardSummaries] = useState<Record<string, string>>({});
  const [isLoadingCardSummaries, setIsLoadingCardSummaries] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<string>('');
  const [isLoadingSelectedExplanation, setIsLoadingSelectedExplanation] = useState(false);
  const [showMobileViewTip, setShowMobileViewTip] = useState(false);

  const aiContext = useMemo(() => ({
    filters,
    buses,
    scenarioId: activeScenarioId,
  }), [activeScenarioId, buses, filters]);

  const topRecommendation = useMemo(
    () => [...buses].sort((a, b) => b.boardingChance - a.boardingChance)[0] ?? null,
    [buses],
  );

  useEffect(() => {
    let isCancelled = false;

    setIsLoadingCardSummaries(true);
    getBusCardDescriptions(aiContext)
      .then((summaries) => {
        if (!isCancelled) {
          setCardSummaries(summaries);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingCardSummaries(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [aiContext]);

  useEffect(() => {
    let isCancelled = false;

    if (!selectedBus) {
      setSelectedExplanation('');
      setIsLoadingSelectedExplanation(false);
      return;
    }

    setIsLoadingSelectedExplanation(true);
    getSelectedBusExplanation(selectedBus, aiContext)
      .then((text) => {
        if (!isCancelled) {
          setSelectedExplanation(text);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingSelectedExplanation(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [aiContext, selectedBus]);

  useEffect(() => {
    if (!selectedBus) {
      return;
    }

    setSelectedExplanation(recommendationSummary(selectedBus.recommendation));
  }, [selectedBus]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isDesktopViewport = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktopViewport) {
      return;
    }

    const hasSeenTip = window.localStorage.getItem(MOBILE_VIEW_TIP_KEY) === '1';
    if (!hasSeenTip) {
      setShowMobileViewTip(true);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowMobileViewTip(false);
    }
  }, [isMobile]);

  const dismissMobileViewTip = () => {
    setShowMobileViewTip(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MOBILE_VIEW_TIP_KEY, '1');
    }
  };

  return (
    <div className="min-h-screen bg-background md:bg-[radial-gradient(120%_80%_at_8%_0%,hsl(var(--secondary))_0%,transparent_56%),radial-gradient(120%_80%_at_92%_0%,hsl(var(--accent))_0%,transparent_56%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--secondary)/0.28))]">
      <div className="w-full max-w-[430px] md:max-w-[390px] mx-auto px-4 pb-8 md:pb-12">
        {showMobileViewTip && !isMobile && (
          <div className="pt-4 md:pt-6">
            <div className="rounded-2xl border border-primary/20 bg-card/95 shadow-soft backdrop-blur px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MonitorSmartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">Desktop tip</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                      Press <span className="font-semibold text-foreground">Ctrl + Shift + I</span>, then <span className="font-semibold text-foreground">Ctrl + Shift + M</span> to open mobile view.
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissMobileViewTip}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Dismiss instruction"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          'md:mt-3 md:rounded-[30px] md:border md:border-border/70 md:bg-background/95 md:px-4 md:shadow-[0_24px_60px_-30px_hsl(var(--foreground)/0.45)]',
        )}>
        <Header
          filters={filters}
          onUpdateStop={(stopId) => updateFilter('stopId', stopId)}
        />

        <div className="space-y-5 pb-4">
          <TransitMap selectedStopId={filters.stopId} buses={buses} selectedBus={selectedBus} />
          <ScenariosPanel currentFilters={filters} onUpdateFilter={updateFilter} onApply={applyScenario} />
          {topRecommendation && (
            <TopRecommendationCard
              bus={topRecommendation}
              summary={cardSummaries[topRecommendation.id]}
              onSelect={setSelectedBusId}
            />
          )}
          <AskBusBuddyPanel
            filters={filters}
            buses={buses}
            selectedBus={selectedBus}
            scenarioId={activeScenarioId}
          />
          <BusList
            buses={buses}
            selectedBusId={selectedBusId}
            onSelectBus={setSelectedBusId}
            aiSummaries={cardSummaries}
            isLoadingSummaries={isLoadingCardSummaries}
          />
          {!isMobile && selectedBus && (
            <BusDetail
              bus={selectedBus}
              onClose={() => setSelectedBusId(null)}
              isMobile={false}
              aiExplanation={selectedExplanation}
              aiExplanationLoading={isLoadingSelectedExplanation}
            />
          )}
          {!isMobile && !selectedBus && (
            <div className="bg-card rounded-2xl border border-border shadow-card p-8 text-center">
              <p className="text-muted-foreground text-sm">Tap a bus above to see detailed insights</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {isMobile && selectedBus && (
        <BusDetail
          bus={selectedBus}
          onClose={() => setSelectedBusId(null)}
          isMobile={true}
          aiExplanation={selectedExplanation}
          aiExplanationLoading={isLoadingSelectedExplanation}
        />
      )}
    </div>
  );
}
