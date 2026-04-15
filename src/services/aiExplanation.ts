import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  type GenerativeModel,
} from 'firebase/ai';
import type { AppFilters, BusApproach, Recommendation } from '@/types';
import { GEMINI_MODEL_NAME, getFirebaseApp, isFirebaseConfigured } from './firebase';

interface AskInput {
  question: string;
  filters: AppFilters;
  buses: BusApproach[];
  selectedBus: BusApproach | null;
  scenarioId: string;
}

interface SharedContext {
  filters: AppFilters;
  buses: BusApproach[];
  scenarioId: string;
}

const textCache = new Map<string, string>();
const objectCache = new Map<string, Record<string, string>>();
const inflightText = new Map<string, Promise<string>>();
const inflightObject = new Map<string, Promise<Record<string, string>>>();

let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (model) {
    return model;
  }

  const app = getFirebaseApp();
  const ai = getAI(app, {
    backend: new GoogleAIBackend(),
  });

  model = getGenerativeModel(ai, {
    model: GEMINI_MODEL_NAME,
    generationConfig: {
      temperature: 0.12,
      maxOutputTokens: 140,
    },
  });

  return model;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 4500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini request timed out')), timeoutMs);
    }),
  ]);
}

function compactBus(bus: BusApproach): string {
  const reasons = bus.reasons
    .slice(0, 3)
    .map((reason) => `${reason.label}: ${reason.detail}`)
    .join(' | ');

  return [
    `route=${bus.routeNumber}`,
    `dest=${bus.destination}`,
    `eta=${bus.eta}`,
    `crowd=${bus.crowdLevel}`,
    `chance=${bus.boardingChance}`,
    `confidence=${bus.confidence}`,
    `recommendation=${bus.recommendation}`,
    `reasons=${reasons}`,
  ].join(', ');
}

function contextBlock(filters: AppFilters, scenarioId: string, buses: BusApproach[]): string {
  const busesBlock = buses.map((bus) => `- ${compactBus(bus)}`).join('\n');

  return [
    `stop=${filters.stopId}`,
    `profile=${filters.profile}`,
    `timeOfDay=${filters.timeOfDay}`,
    `weather=${filters.weather}`,
    `scenario=${scenarioId || 'none'}`,
    'buses:',
    busesBlock,
  ].join('\n');
}

function localSummaryLine(bus: BusApproach): string {
  if (bus.recommendation === 'board') {
    if (bus.eta <= 4) {
      return 'Best current option for quick boarding.';
    }

    return 'Good boarding chance with manageable crowd.';
  }

  if (bus.recommendation === 'wait') {
    if (bus.eta <= 5) {
      return 'Borderline option. Wait if the queue grows.';
    }

    return 'Balanced risk. Recheck before arrival.';
  }

  if (bus.crowdLevel === 'packed') {
    return 'Crowded bus. Skipping is safer right now.';
  }

  return 'Low boarding odds for this arrival.';
}

function localExplanation(bus: BusApproach): string {
  const top = bus.reasons[0]?.detail ?? 'current pressure and occupancy';
  if (bus.recommendation === 'board') {
    return `Board this bus. ${top}.`;
  }

  if (bus.recommendation === 'wait') {
    return `Wait for a better boarding window. ${top}.`;
  }

  return `Skip this bus for now. ${top}.`;
}

function fallbackAsk({ question, buses, selectedBus }: AskInput): string {
  const sorted = [...buses].sort((a, b) => b.boardingChance - a.boardingChance);
  const best = sorted[0];
  const query = question.toLowerCase();

  if (query.includes('best') || query.includes('which bus')) {
    if (!best) {
      return 'No buses are visible right now. Try changing the stop.';
    }

    return `Best current option is ${best.routeNumber} to ${best.destination} with ${best.boardingChance}% boarding chance.`;
  }

  if (query.includes('why') && selectedBus) {
    return `${selectedBus.routeNumber} is marked ${selectedBus.recommendation} because ${selectedBus.reasons[0]?.detail ?? 'current boarding conditions are not favorable'}.`;
  }

  if (query.includes('crowd')) {
    const crowded = buses
      .filter((bus) => bus.crowdLevel === 'high' || bus.crowdLevel === 'packed')
      .map((bus) => bus.routeNumber);
    return crowded.length > 0
      ? `Higher crowd routes now: ${crowded.join(', ')}. Consider wait/skip decisions on these.`
      : 'Current visible buses are not heavily crowded.';
  }

  if (!best) {
    return 'I cannot evaluate right now because no buses are visible for this stop.';
  }

  return `Use ${best.routeNumber} as your current reference; it has the strongest boarding chance (${best.boardingChance}%).`;
}

function callGeminiForText(key: string, prompt: string, fallbackText: string): Promise<string> {
  if (textCache.has(key)) {
    return Promise.resolve(textCache.get(key) as string);
  }

  if (inflightText.has(key)) {
    return inflightText.get(key) as Promise<string>;
  }

  const request = (async () => {
    if (!isFirebaseConfigured) {
      textCache.set(key, fallbackText);
      return fallbackText;
    }

    try {
      const result = await withTimeout(getModel().generateContent(prompt));
      const text = result.response.text().replace(/\s+/g, ' ').trim();
      const safeText = text || fallbackText;
      textCache.set(key, safeText);
      return safeText;
    } catch {
      textCache.set(key, fallbackText);
      return fallbackText;
    } finally {
      inflightText.delete(key);
    }
  })();

  inflightText.set(key, request);
  return request;
}

async function callGeminiForObject(
  key: string,
  prompt: string,
  fallback: Record<string, string>,
): Promise<Record<string, string>> {
  if (objectCache.has(key)) {
    return objectCache.get(key) as Record<string, string>;
  }

  if (inflightObject.has(key)) {
    return inflightObject.get(key) as Promise<Record<string, string>>;
  }

  const request = (async () => {
    if (!isFirebaseConfigured) {
      objectCache.set(key, fallback);
      return fallback;
    }

    try {
      const result = await withTimeout(getModel().generateContent(prompt));
      const raw = result.response
        .text()
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/, '')
        .trim();
      const parsed = JSON.parse(raw) as Record<string, string>;
      const merged: Record<string, string> = { ...fallback };

      for (const [busId, text] of Object.entries(parsed)) {
        if (typeof text === 'string' && text.trim().length > 0) {
          merged[busId] = text.trim();
        }
      }

      objectCache.set(key, merged);
      return merged;
    } catch {
      objectCache.set(key, fallback);
      return fallback;
    } finally {
      inflightObject.delete(key);
    }
  })();

  inflightObject.set(key, request);
  return request;
}

export function getBusDescriptionCacheKey(
  context: SharedContext,
): string {
  const ids = context.buses.map((bus) => bus.id).join(',');
  return [
    context.filters.stopId,
    context.filters.profile,
    context.filters.timeOfDay,
    context.filters.weather,
    context.scenarioId || 'none',
    ids,
  ].join('|');
}

export function getSelectedBusExplanationCacheKey(
  busId: string,
  context: SharedContext,
): string {
  return [
    context.filters.stopId,
    busId,
    context.filters.profile,
    context.filters.timeOfDay,
    context.filters.weather,
    context.scenarioId || 'none',
  ].join('|');
}

export function getAskCacheKey(input: AskInput): string {
  return [
    input.question.trim().toLowerCase(),
    input.filters.stopId,
    input.selectedBus?.id ?? 'none',
    input.filters.profile,
    input.filters.timeOfDay,
    input.filters.weather,
    input.scenarioId || 'none',
  ].join('|');
}

export async function getSelectedBusExplanation(
  bus: BusApproach,
  context: SharedContext,
): Promise<string> {
  const key = getSelectedBusExplanationCacheKey(bus.id, context);
  const fallback = localExplanation(bus);
  const prompt = [
    'You are BusBuddy assistant for Bengaluru commuters.',
    'Use ONLY the provided context. Do not invent transit facts.',
    'Return 1 or 2 short practical sentences.',
    'Explain the selected bus recommendation to the user.',
    contextBlock(context.filters, context.scenarioId, context.buses),
    `selected_bus: ${compactBus(bus)}`,
  ].join('\n');

  return callGeminiForText(key, prompt, fallback);
}

export async function getBusCardDescriptions(
  context: SharedContext,
): Promise<Record<string, string>> {
  const key = getBusDescriptionCacheKey(context);
  const fallback = context.buses.reduce<Record<string, string>>((acc, bus) => {
    acc[bus.id] = localSummaryLine(bus);
    return acc;
  }, {});

  const prompt = [
    'You are generating very short scan-friendly summaries for bus cards.',
    'Use ONLY the provided context. No external facts.',
    'Return JSON object keyed by bus id, each value is one short sentence (max 12 words).',
    'Keep practical commuter tone.',
    contextBlock(context.filters, context.scenarioId, context.buses),
    `required_ids: ${context.buses.map((bus) => bus.id).join(',')}`,
    'Return valid JSON only.',
  ].join('\n');

  return callGeminiForObject(key, prompt, fallback);
}

export async function askBusBuddy(input: AskInput): Promise<string> {
  const key = getAskCacheKey(input);
  const fallback = fallbackAsk(input);
  const prompt = [
    'You are BusBuddy in-app assistant.',
    'Use ONLY the supplied app context and bus data. Never invent unsupported details.',
    'Keep answer concise and commuter-friendly (max 3 short sentences).',
    input.selectedBus ? `selected_bus: ${compactBus(input.selectedBus)}` : 'selected_bus: none',
    contextBlock(input.filters, input.scenarioId, input.buses),
    `user_question: ${input.question.trim()}`,
  ].join('\n');

  return callGeminiForText(key, prompt, fallback);
}

export function recommendationSummary(recommendation: Recommendation): string {
  if (recommendation === 'board') {
    return 'Best current option for boarding.';
  }

  if (recommendation === 'wait') {
    return 'Borderline call. Waiting may improve odds.';
  }

  return 'Current bus is likely too crowded to board.';
}
