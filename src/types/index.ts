export type Recommendation = 'board' | 'wait' | 'skip';

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'packed';

export type TimeOfDay = 'morning_peak' | 'afternoon' | 'evening_peak' | 'night';

export type Weather = 'clear' | 'light_rain' | 'heavy_rain';

export type Profile = 'solo' | 'student' | 'woman' | 'senior';

export interface BusStop {
  id: string;
  name: string;
  shortName: string;
}

export interface ReasonFactor {
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
  detail: string;
}

export interface BusApproach {
  id: string;
  routeNumber: string;
  destination: string;
  eta: number; // minutes
  crowdLevel: CrowdLevel;
  boardingChance: number; // 0-100
  confidence: number; // 0-100
  recommendation: Recommendation;
  reasons: ReasonFactor[];
  aiExplanation: string;
}

export interface Scenario {
  id: string;
  label: string;
  stopId: string;
  timeOfDay: TimeOfDay;
  weather: Weather;
  profile: Profile;
}

export interface AppFilters {
  stopId: string;
  profile: Profile;
  timeOfDay: TimeOfDay;
  weather: Weather;
}
