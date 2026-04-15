import { useEffect, useMemo, useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="w-full max-w-[460px] mx-auto px-4 pb-8">
        <Header
          filters={filters}
          onUpdateStop={(stopId) => updateFilter('stopId', stopId)}
        />

        <div className="space-y-5 pb-4">
          <TransitMap selectedStopId={filters.stopId} />
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
