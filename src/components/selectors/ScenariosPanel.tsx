import { scenarios } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { AppFilters, Profile, TimeOfDay, Weather } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ScenariosPanelProps {
  currentFilters: AppFilters;
  onUpdateFilter: <K extends keyof AppFilters>(key: K, value: AppFilters[K]) => void;
  onApply: (scenarioId: string, stopId: string, timeOfDay: AppFilters['timeOfDay'], weather: AppFilters['weather'], profile: AppFilters['profile']) => void;
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; emoji?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="text-[9px] font-medium text-muted-foreground/85 uppercase tracking-[0.18em] mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-150 border',
              opt.value === value
                ? 'bg-primary text-primary-foreground border-primary shadow-card ring-1 ring-primary/30'
                : 'bg-background/65 text-foreground/75 border-border/70 hover:border-primary/30 hover:text-foreground active:scale-95',
            )}
          >
            {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ScenariosPanel({ currentFilters, onApply, onUpdateFilter }: ScenariosPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border/70 shadow-soft px-4 pt-4 pb-3">
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-xs font-semibold font-heading text-foreground uppercase tracking-wider">Try Demo Scenarios</h2>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </button>
      <p className="mt-1 text-[11px] text-muted-foreground">Tap a preset to instantly change bus conditions.</p>
      <div
        className={cn(
          'space-y-3.5 overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[900px] mt-3 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ChipGroup<Profile>
          label="Profile"
          options={[
            { value: 'solo', label: 'Solo', emoji: '🧑' },
            { value: 'student', label: 'Student', emoji: '🎒' },
            { value: 'woman', label: 'Woman', emoji: '👩' },
            { value: 'senior', label: 'Senior', emoji: '👴' },
          ]}
          value={currentFilters.profile}
          onChange={(value) => onUpdateFilter('profile', value)}
        />

        <ChipGroup<TimeOfDay>
          label="Time"
          options={[
            { value: 'morning_peak', label: 'Morning', emoji: '🌅' },
            { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
            { value: 'evening_peak', label: 'Evening', emoji: '🌆' },
            { value: 'night', label: 'Night', emoji: '🌙' },
          ]}
          value={currentFilters.timeOfDay}
          onChange={(value) => onUpdateFilter('timeOfDay', value)}
        />

        <ChipGroup<Weather>
          label="Weather"
          options={[
            { value: 'clear', label: 'Clear', emoji: '☀️' },
            { value: 'light_rain', label: 'Drizzle', emoji: '🌦️' },
            { value: 'heavy_rain', label: 'Heavy', emoji: '🌧️' },
          ]}
          value={currentFilters.weather}
          onChange={(value) => onUpdateFilter('weather', value)}
        />

        <div className="h-px bg-border/40" />

        <div className="grid grid-cols-2 gap-2">
        {scenarios.map(s => {
          const isActive = s.stopId === currentFilters.stopId &&
            s.timeOfDay === currentFilters.timeOfDay &&
            s.weather === currentFilters.weather &&
            s.profile === currentFilters.profile;
          return (
            <button
              key={s.id}
              onClick={() => onApply(s.id, s.stopId, s.timeOfDay, s.weather, s.profile)}
              className={cn(
                'px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-150 border text-left leading-tight',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-card ring-2 ring-primary/30'
                  : 'bg-background/65 text-foreground/80 border-border/70 hover:border-primary/35 active:scale-[0.97]'
              )}
            >
              {s.label}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
