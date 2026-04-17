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

- Narrow mobile-style app canvas on desktop for app-like preview.
- Google Maps-powered Boarding View with stop markers and transit directions.
- Scenario + condition controls (profile, time, weather, presets).
- Top Recommendation decision card.
- Approaching bus cards with Board/Wait/Skip badges.
- Bus detail sheet with factors + AI explanation.
- Ask BusBuddy AI panel with contextual Q&A.
- Desktop-only atmospheric gradient shell for polished large-screen presentation.
- One-time desktop hint to open browser mobile emulation quickly.
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
- Google Maps JavaScript API 
- Directions API
- Places API
- Firebase Hosting
- Firebase AI Logic Web SDK + Gemini Developer API backend
- Framer Motion (detail/interaction motion)

## Desktop Testing Tip

On first desktop visit, BusBuddy shows a one-time hint card for mobile emulation.

- Press `Ctrl + Shift + I`
- Then press `Ctrl + Shift + M`

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
