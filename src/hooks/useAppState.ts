import { useState, useCallback, useMemo } from 'react';
import type { AppFilters, BusApproach } from '@/types';
import { getMockBuses } from '@/data/mockData';

const defaultFilters: AppFilters = {
  stopId: 'silk-board',
  profile: 'solo',
  timeOfDay: 'morning_peak',
  weather: 'clear',
};

export function useAppState() {
  const [filters, setFilters] = useState<AppFilters>(defaultFilters);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('none');

  const buses = useMemo(() => getMockBuses(filters), [filters]);

  const selectedBus = useMemo(
    () => buses.find(b => b.id === selectedBusId) || null,
    [buses, selectedBusId],
  );

  const updateFilter = useCallback(<K extends keyof AppFilters>(key: K, value: AppFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveScenarioId('none');
    setSelectedBusId(null);
  }, []);

  const applyScenario = useCallback((scenarioId: string, stopId: string, timeOfDay: AppFilters['timeOfDay'], weather: AppFilters['weather'], profile: AppFilters['profile']) => {
    setFilters({ stopId, timeOfDay, weather, profile });
    setActiveScenarioId(scenarioId);
    setSelectedBusId(null);
  }, []);

  return {
    filters,
    buses,
    selectedBus,
    selectedBusId,
    activeScenarioId,
    setSelectedBusId,
    updateFilter,
    applyScenario,
  };
}
