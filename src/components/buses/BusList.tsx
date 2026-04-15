import type { BusApproach } from '@/types';
import { BusCard } from './BusCard';

interface BusListProps {
  buses: BusApproach[];
  selectedBusId: string | null;
  onSelectBus: (id: string) => void;
  aiSummaries: Record<string, string>;
  isLoadingSummaries: boolean;
}

export function BusList({ buses, selectedBusId, onSelectBus, aiSummaries, isLoadingSummaries }: BusListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-semibold font-heading text-foreground uppercase tracking-wider">
          Approaching Buses
        </h2>
        <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{buses.length} buses</span>
      </div>
      <div className="space-y-2.5">
        {buses.map(bus => (
          <BusCard
            key={bus.id}
            bus={bus}
            isSelected={bus.id === selectedBusId}
            onSelect={onSelectBus}
            summary={aiSummaries[bus.id]}
            summaryLoading={isLoadingSummaries}
          />
        ))}
      </div>
    </div>
  );
}
