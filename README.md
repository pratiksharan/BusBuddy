# BusBuddy

BusBuddy is a map-first web app that helps Bengaluru commuters decide whether to board, wait, or skip an approaching bus.

Live demo: https://model-wave-493404-c4.web.app/

## Problem Statement

At crowded bus stops, commuters make fast decisions with incomplete information:

- Is this bus too full to board?
- Should I wait for the next one?
- Is trying now worth the risk?

The MVP focuses on converting noisy commute context into one clear action: Board, Wait, or Skip.

## Solution Overview

BusBuddy combines deterministic local scoring with AI-powered explanations:

- A local rules-based scorer estimates boarding chance and recommendation per bus.
- Gemini (through Firebase AI Logic) turns model/context output into short, user-friendly explanations.
- The UI surfaces a top recommendation, route-level cards, and a contextual Ask panel.

## Key Features

- Fixed-width mobile-style app canvas for both desktop and mobile.
- Live Boarding View map panel with stop selection.
- Scenario + condition controls (profile, time, weather, presets).
- Top Recommendation decision card.
- Approaching bus cards with Board/Wait/Skip badges.
- Bus detail sheet with factors + AI explanation.
- Ask BusBuddy AI panel with contextual Q&A.
- Firebase Hosting deployment.

## How Recommendation Works

The Board/Wait/Skip output is deterministic and local.

- Source data: local simulated buses/scenarios.
- Scoring behavior: penalties and adjustments are applied from context and profile.
- Recommendation thresholds are derived from computed boarding chance bands.
- No backend scoring service is used in this MVP.

Current implementation source of truth:

- Local data and scenario generation: [src/data/mockData.ts](src/data/mockData.ts)
- App state and filter/scenario selection: [src/hooks/useAppState.ts](src/hooks/useAppState.ts)
- Scoring service wrapper (local): [src/services/scoring.ts](src/services/scoring.ts)

## What AI Is Used For

AI is used for explanation and assistant UX, not for core scoring.

- Selected bus explanation
- Short bus-card summaries
- Ask BusBuddy user queries

AI wiring details:

- Firebase app/env bootstrap: [src/services/firebase.ts](src/services/firebase.ts)
- Gemini + cache/dedupe + fallback logic: [src/services/aiExplanation.ts](src/services/aiExplanation.ts)

If Gemini is unavailable or Firebase env vars are missing, local fallbacks are used.

## MVP Data Source

This prototype uses simulated transit data in code.

Why simulated:

- Hackathon speed and reliability
- No live transit API integration required for MVP
- Keeps demo deterministic and reproducible

Important: This repository does not claim live BMTC integration.

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + Radix UI primitives
- Firebase Hosting
- Firebase AI Logic Web SDK + Gemini Developer API backend
- Framer Motion (detail/interaction motion)

## Project Structure

```text
src/
  components/        # UI components (map, selectors, buses, detail, assistant)
  data/              # Local mock stops, scenarios, buses
  hooks/             # App state + shared hooks
  lib/               # Utilities
  pages/             # Main screen entry
  services/          # Firebase setup, AI logic, scoring service wrapper
  test/              # Vitest setup/examples
  types/             # Shared domain types
  utils/             # Display label helpers
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file from template:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Fill `.env.local` with your Firebase web config + model.

4. Start dev server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:5173
```

## Environment Variables

Expected keys:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_MODEL` (example: `gemini-2.5-flash-lite`)

Template file: [.env.example](.env.example)

## Build

```bash
npm run build
```

Optional local preview:

```bash
npm run preview
```

## Deploy (Firebase Hosting)

1. Authenticate and select project:

```bash
npx firebase-tools login
npx firebase-tools use model-wave-493404-c4
```

2. Build and deploy:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

Hosting config is in [firebase.json](firebase.json).

## Current MVP Limitations

- Uses simulated transit data (not live bus telemetry).
- No rider accounts or personalization persistence.
- No backend analytics pipeline.
- No operational ETA uncertainty model beyond local heuristics.

## Future Improvements

- Integrate live transit feeds and crowd signals.
- Add route history and personal commute preferences.
- Add multilingual voice-first assistance.
- Add confidence calibration from historical outcomes.
- Add richer incident/weather disruption handling.

## Hackathon Note

BusBuddy is a hackathon prototype focused on fast validation of boarding decision support UX using deterministic local logic + AI explanation.
