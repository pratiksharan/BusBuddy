import { MapPin } from 'lucide-react';
import type { AppFilters } from '@/types';
import { stops } from '@/data/mockData';
import { getTimeLabel, getWeatherLabel, getTimeEmoji, getWeatherEmoji } from '@/utils/labels';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  filters: AppFilters;
  onUpdateStop: (stopId: string) => void;
}

export function Header({ filters, onUpdateStop }: HeaderProps) {
  const stop = stops.find(s => s.id === filters.stopId);

  return (
    <header className="pt-6 pb-4">
      <div className="mb-3">
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Bus<span className="text-board">Buddy</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">
          Bengaluru bus boarding signal
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card text-[11px] font-medium text-foreground border border-border shadow-soft">
            {getTimeEmoji(filters.timeOfDay)} {getTimeLabel(filters.timeOfDay)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card text-[11px] font-medium text-foreground border border-border shadow-soft">
            {getWeatherEmoji(filters.weather)} {getWeatherLabel(filters.weather)}
          </span>
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-border bg-card/70 p-3 shadow-soft">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Your location</label>
        <Select value={filters.stopId} onValueChange={onUpdateStop}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-background text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-board" />
              <SelectValue placeholder="Select location" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-card shadow-card">
            {stops.map((item) => (
              <SelectItem key={item.id} value={item.id} className="rounded-md text-sm">
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-2.5">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Your stop</label>
          <Select value={filters.stopId} onValueChange={onUpdateStop}>
            <SelectTrigger className="h-10 rounded-xl border-border bg-background text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-board" />
                <SelectValue placeholder="Select stop" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card shadow-card">
              {stops.map((item) => (
                <SelectItem key={item.id} value={item.id} className="rounded-md text-sm">
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

    </header>
  );
}
