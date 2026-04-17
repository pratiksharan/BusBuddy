# BusBuddy

BusBuddy is a decision-support web app for Bengaluru commuters. It helps riders decide whether to board, wait, or skip an incoming bus.

Live demo: https://model-wave-493404-c4.web.app/

Status: Hackathon MVP. Core decision logic is deterministic and local; AI is used only for explanations.

## Core Experience

- Shows approaching buses for a selected stop.
- Computes boarding chance and a recommendation per bus: Board, Wait, or Skip.
- Highlights a top recommendation.
- Provides reasoned bus details and an Ask BusBuddy follow-up panel.
- Displays route and stop context on a Google Maps view.

## Decision Model (Local and Deterministic)

Recommendations are computed locally from simulated route and scenario data.

Factors include:

- bus crowding and occupancy
- time/weather conditions
- route and urgency context
- rider profile and scenario presets

Chance bands are mapped to Board/Wait/Skip thresholds. AI does not determine the recommendation.

Implementation references:

- [src/data/mockData.ts](src/data/mockData.ts)
- [src/hooks/useAppState.ts](src/hooks/useAppState.ts)
- [src/services/scoring.ts](src/services/scoring.ts)

## AI Scope

AI is used for explanation quality, not decision logic:

- selected bus explanation
- short bus-card summaries
- Ask BusBuddy responses

Service wiring:

- [src/services/firebase.ts](src/services/firebase.ts)
- [src/services/aiExplanation.ts](src/services/aiExplanation.ts)

If Gemini or Firebase config is unavailable, local fallback text is returned.

## Data Boundaries

This repository uses simulated transit data. It does not include live BMTC telemetry integration.

## Tech Stack

- React 18, Vite, TypeScript
- Tailwind CSS and Radix UI
- Google Maps JavaScript API via @react-google-maps/api
- Firebase AI Logic Web SDK with Gemini
- Firebase Hosting

## Limitations

- Simulated data only
- No rider accounts or persisted personalization
- No backend analytics pipeline
- No historical calibration for uncertainty

## Roadmap

- Integrate live transit and crowd signals
- Add personalized commute memory
- Improve confidence calibration with real outcomes
