/**
 * Scoring service placeholder.
 * Replace with real scoring logic or remote scoring API.
 */

import type { BusApproach, AppFilters } from '@/types';
import { getMockBuses } from '@/data/mockData';

export async function scoreBuses(filters: AppFilters): Promise<BusApproach[]> {
  // Placeholder: return mock data
  // Future: call scoring API or run local scoring model
  return getMockBuses(filters);
}
