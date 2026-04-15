import type { Recommendation, CrowdLevel, TimeOfDay, Weather, Profile } from '@/types';

export function getRecommendationLabel(rec: Recommendation): string {
  return { board: 'Board', wait: 'Wait', skip: 'Skip' }[rec];
}

export function getCrowdLabel(level: CrowdLevel): string {
  return { low: 'Low', moderate: 'Moderate', high: 'High', packed: 'Packed' }[level];
}

export function getTimeLabel(t: TimeOfDay): string {
  return { morning_peak: 'Morning Peak', afternoon: 'Afternoon', evening_peak: 'Evening Peak', night: 'Night' }[t];
}

export function getWeatherLabel(w: Weather): string {
  return { clear: 'Clear', light_rain: 'Light Rain', heavy_rain: 'Heavy Rain' }[w];
}

export function getProfileLabel(p: Profile): string {
  return { solo: 'Solo Commuter', student: 'Student', woman: 'Woman Commuter', senior: 'Senior Citizen' }[p];
}

export function getProfileEmoji(p: Profile): string {
  return { solo: '🧑', student: '🎒', woman: '👩', senior: '👴' }[p];
}

export function getTimeEmoji(t: TimeOfDay): string {
  return { morning_peak: '🌅', afternoon: '☀️', evening_peak: '🌆', night: '🌙' }[t];
}

export function getWeatherEmoji(w: Weather): string {
  return { clear: '☀️', light_rain: '🌦️', heavy_rain: '🌧️' }[w];
}
