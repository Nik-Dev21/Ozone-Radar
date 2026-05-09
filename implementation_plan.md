# OzoneRadar Implementation Plan

Based on the instructions provided, we are going to build **OzoneRadar**, a real-time environmental pollution monitoring Expo Go mobile app.

Since the instructions specify to do everything task by task and wait for confirmation before proceeding, here is the proposed task list for the development of OzoneRadar.

## Proposed Changes / Task Breakdown

### Task 1: Scaffold App and Install Dependencies
- Run `npx create-expo-app@latest ozone-radar --template blank-typescript`
- Move created files up from `ozone-radar` to the current directory (or scaffold in the current directory if possible).
- Install all specified dependencies (Expo packages and community packages).
- Configure `app.json`.
- Create `.env.example` and set up the directory structure.
- Configure NativeWind (v4 or v5 as specified in skills) and Babel.

### Task 2: Core Types and Constants
- Create `services/types.ts` with `LayerId`, `PollutionPoint`, `AIBriefing`, and `CitizenReport`.
- Create `constants/layers.ts` with configuration for methane, no2, pm25, co, and wildfire.
- Create `constants/theme.ts` for dark theme tokens.
- Create `constants/prompts.ts` for the LLM system prompt.

### Task 3: Data Services
- Implement `services/copernicus.ts` with auto-refreshing OAuth token caching.
- Implement `services/firms.ts` to parse NASA FIRMS CSV.
- Implement `services/openMeteo.ts` and `services/openWeather.ts` for Open-Meteo AQ and forecast.
- Implement `services/llm.ts` to call OpenAI (with instructions for switching to Featherless).
- Implement `services/cloudant.ts` for IBM Cloudant CRUD.

### Task 4: State Stores (Zustand)
- Implement `store/useFilterStore.ts` to manage active layers.
- Implement `store/useMapStore.ts` to manage selected point and map region.

### Task 5: Data Fetching Hooks (TanStack Query)
- Implement `hooks/useMapData.ts` to fetch all layer data in parallel.
- Implement `hooks/useAIExplanation.ts` to handle LLM calls.
- Implement `hooks/useUserLocation.ts` for geolocation with a fallback to Toronto.
- Implement `hooks/useReports.ts` for cloudant reports fetching and saving.

### Task 6: UI Components
- Implement reusable UI components in `components/ui/`: `FilterChip`, `FilterBar`, `DetailSheet`, `SeverityBadge`, `LoadingPulse`, `ReportForm`.

### Task 7: Map Components
- Implement map-specific components in `components/map/`: `PollutionMap` and `HotspotMarker`.

### Task 8: Layouts and Routing
- Set up root layout in `app/_layout.tsx` (Providers, GestureHandler).
- Set up tab layout in `app/(tabs)/_layout.tsx`.

### Task 9: Screens
- Implement `app/(tabs)/index.tsx` (Map screen).
- Implement `app/(tabs)/reports.tsx` (Reports feed).
- Implement `app/(tabs)/about.tsx` (Credits & data sources).

## User Review Required
Please review the above task breakdown. Once you approve this plan, I will begin with **Task 1: Scaffold App and Install Dependencies**, and wait for your confirmation before moving to the next task.

## Open Questions
- Should the app be scaffolded directly in the current directory (`/Users/sukhman/Documents/Codehub/Projects/ibm`) or in a sub-folder named `ozone-radar`? I will assume we should scaffold in the current directory since the repository already contains `.env` and `CLAUDE.md`.
