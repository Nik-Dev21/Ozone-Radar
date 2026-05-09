# OzoneRadar — Claude Code Instructions

You are building **OzoneRadar**, a real-time environmental pollution monitoring
map as an Expo Go mobile app for the IBM Z × Sheridan Hackathon.

Before writing any code:
1. Read `CLAUDE.md` for the project overview and quick reference
2. Read all skills in `.agent/skills/` — run `bash setup-skills.sh` first if
   the folder is empty

---

## What you are building

A dark-themed mobile map app where users can:
- See live pollution hotspots across multiple environmental layers (methane, NO2,
  PM2.5, CO, wildfire) rendered as colored markers on a map
- Toggle individual layers on/off using a filter chip bar at the bottom of the map
- Tap any hotspot to open a bottom sheet with an AI-generated plain-language
  health briefing (explanation, recommended action, urgency rating)
- Submit citizen pollution reports that are saved to IBM Cloudant
- Browse past community reports in a separate tab

The IBM angle for judges: IBM Cloudant powers the citizen science layer.
The AI angle: tapping a hotspot triggers an LLM call that translates raw satellite
numbers into a human-readable health briefing.

---

## Skills to apply

Skills are in `.agent/skills/`. Apply them as follows — don't wait to be asked:

- `building-native-ui` + `vercel-react-native` — apply to every component,
  screen, and animation. These define how native UI should feel and perform.
- `native-data-fetching` — apply to all hooks and service calls. Use TanStack
  Query patterns from this skill, not ad hoc fetch + useState.
- `expo-tailwind-setup` — apply when configuring NativeWind and writing any
  Tailwind classes.
- `typescript-magician` + `node-best-practices` — apply throughout. No `any`,
  no loose error handling.
- `vercel-web-design` + `enhance-prompt` + `design-md` — apply when making
  UI decisions. Use the design vocabulary and dark-theme patterns from these
  skills to produce polished, non-generic interfaces.
- `vercel-react-practices` — apply to component structure and composition.
- `upgrading-expo` — consult if you hit an SDK version error or deprecated API.

---

## Scaffold

Use `create-expo-app` with the blank TypeScript template. The app must run in
**Expo Go** — do not use any libraries that require a custom native build.

---

## Dependencies to install

Use `npx expo install` for Expo-managed packages and `npm install` for the rest.

Expo packages needed:
- `expo-router` — file-based navigation
- `expo-location` — user's GPS position to center the map
- `expo-haptics` — tactile feedback on filter toggles and hotspot taps
- `expo-constants` — access to env vars

Community packages needed:
- `react-native-maps` — the map itself (works in Expo Go)
- `react-native-reanimated` — smooth animations
- `react-native-safe-area-context` and `react-native-screens` — required by Router
- `react-native-gesture-handler` — required by bottom sheet
- `@gorhom/bottom-sheet` — the pollution detail panel that slides up on tap
- `@react-native-async-storage/async-storage` — persist filter preferences
- `nativewind` + `tailwindcss` — Tailwind utility classes for styling
- `zustand` — global UI state
- `@tanstack/react-query` — all async data fetching, caching, and error states
- `openai` — LLM calls (OpenAI SDK, compatible with both OpenAI and Featherless)
- `nanoid` — unique IDs for Cloudant documents

---

## Configuration

### NativeWind
Set up `tailwind.config.js` to scan `app/` and `components/`. Include the
NativeWind preset. Extend the theme with the project's color tokens from
`constants/theme.ts` so Tailwind classes like `bg-surface` and `text-methane`
work throughout the app. Consult the `expo-tailwind-setup` skill for the exact
config pattern.

### Babel
Configure `babel.config.js` for Expo with the NativeWind JSX transform and the
Reanimated plugin. Reanimated's plugin must be last.

### app.json
- App name: OzoneRadar, scheme: ozone-radar
- `userInterfaceStyle`: dark
- Splash background: `#0d1117`
- Enable Expo Router in plugins
- Add location permission description for iOS and Android
- Enable `typedRoutes` experiment

### .env
Create `.env` (gitignored) from `.env.example`. All keys use the `EXPO_PUBLIC_`
prefix. Never hardcode any key in source files.

---

## Project structure

Organise the project as follows. Create all directories and placeholder files
before building any feature.

```
ozone-radar/
├── .agent/
│   └── skills/
│       ├── building-native-ui/SKILL.md
│       ├── native-data-fetching/SKILL.md
│       ├── expo-tailwind-setup/SKILL.md
│       ├── upgrading-expo/SKILL.md
│       ├── vercel-react-native/SKILL.md
│       ├── vercel-react-practices/SKILL.md
│       ├── vercel-web-design/SKILL.md
│       ├── typescript-magician/SKILL.md
│       ├── node-best-practices/SKILL.md
│       ├── enhance-prompt/SKILL.md
│       └── design-md/SKILL.md
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        ← map screen
│   │   ├── reports.tsx      ← citizen reports feed
│   │   └── about.tsx        ← data sources and credits
│   └── _layout.tsx          ← root layout with QueryClient and GestureHandler
├── components/
│   ├── map/
│   │   ├── PollutionMap.tsx  ← MapView with all hotspot markers
│   │   └── HotspotMarker.tsx ← single animated circle marker
│   └── ui/
│       ├── FilterChip.tsx   ← individual layer toggle button
│       ├── FilterBar.tsx    ← horizontal scrollable row of chips
│       ├── DetailSheet.tsx  ← bottom sheet with AI briefing
│       ├── SeverityBadge.tsx ← Safe / Caution / Avoid pill
│       ├── LoadingPulse.tsx ← skeleton loader
│       └── ReportForm.tsx   ← form to submit a citizen report
├── services/
│   ├── copernicus.ts        ← Sentinel-5P satellite data + OAuth token
│   ├── firms.ts             ← NASA FIRMS wildfire hotspots
│   ├── openMeteo.ts         ← Open-Meteo air quality (no key)
│   ├── openWeather.ts       ← OpenWeatherMap AQ + forecast
│   ├── llm.ts               ← LLM briefing generation
│   ├── cloudant.ts          ← IBM Cloudant CRUD
│   └── types.ts             ← all shared TypeScript interfaces
├── hooks/
│   ├── useMapData.ts        ← TanStack Query: fetch all active layers in parallel
│   ├── useAIExplanation.ts  ← TanStack mutation: point → AI briefing
│   ├── useUserLocation.ts   ← expo-location wrapper with Toronto fallback
│   └── useReports.ts        ← TanStack Query: read/write Cloudant reports
├── store/
│   ├── useFilterStore.ts    ← which layers are toggled on
│   └── useMapStore.ts       ← selected hotspot, current map region
├── constants/
│   ├── layers.ts            ← layer config (id, label, color, unit, source)
│   ├── theme.ts             ← all design tokens
│   └── prompts.ts           ← LLM system prompt
├── .env
├── .env.example
├── app.json
├── CLAUDE.md
├── OZONERADAR_CLAUDE_CODE_INSTRUCTIONS.md
├── TERRAWATCH_API_SETUP.md
└── setup-skills.sh
```

---

## Build order

Build in this sequence to avoid import errors.

1. `services/types.ts` — define all shared interfaces first
2. `constants/` — layers, theme, prompts
3. `services/` — all data services
4. `store/` — Zustand stores
5. `hooks/` — TanStack Query hooks that call the services
6. `components/ui/` — reusable UI components
7. `components/map/` — map-specific components
8. `app/_layout.tsx` — root layout
9. `app/(tabs)/_layout.tsx` — tab bar
10. `app/(tabs)/index.tsx` — map screen (main feature)
11. `app/(tabs)/reports.tsx` — reports feed
12. `app/(tabs)/about.tsx` — credits and data sources

---

## What each piece does

### `services/types.ts`
Define the core domain types:
- `LayerId` — union type of the five layer names
- `PollutionPoint` — a single data point on the map: id, layerId, lat, lon, value,
  unit, timestamp, severity (low/medium/high)
- `AIBriefing` — the LLM response: explanation, action, urgency (Safe/Caution/Avoid)
- `CitizenReport` — a Cloudant document: type, layerId, description, lat, lon,
  timestamp, severity

### `constants/layers.ts`
An object keyed by `LayerId` where each entry has label, unit, color hex, and
which data source it comes from. This is the single source of truth for layer
config — never hardcode colors or labels elsewhere.

Layer → color mapping:
- methane → amber `#EF9F27`
- no2 → purple `#7F77DD`
- pm25 → teal `#1D9E75`
- co → coral `#D85A30`
- wildfire → red `#E24B4A`

### `constants/theme.ts`
All design tokens as a typed const object. Background `#0d1117`, card surface
`#161b22`, borders at 10% white opacity, text primary `#e6edf3`, text muted at
50% white. Severity colors: safe = teal, caution = amber, avoid = red.
Consult the `vercel-web-design` and `enhance-prompt` skills for how to apply
these tokens to create a polished dark UI.

### `constants/prompts.ts`
The LLM system prompt. Instruct the model to act as an environmental health
communicator. It receives the pollutant name, value, unit, and severity and must
return a JSON object with `explanation` (2–3 plain sentences, no jargon),
`action` (one specific thing the user can do), and `urgency` (Safe/Caution/Avoid).
Response must be under 100 words. Return JSON only, no markdown.

### `services/copernicus.ts`
Fetches methane concentration data from the ESA Copernicus Sentinel-5P satellite
via the Sentinel Hub Statistical API.

Critical detail: the OAuth access token expires every 10 minutes. Implement
in-memory token caching — store the token and its expiry time, check before every
request, and fetch a new token when it's within 60 seconds of expiry. The token
endpoint and base URL are in env vars. Apply the async error handling patterns
from the `node-best-practices` skill.

For the hackathon scope, fetch a statistical summary (median value) for a bounding
box around the user's location and return it as a single representative
`PollutionPoint`. Severity thresholds: above 1900 ppb = high, above 1850 = medium.

### `services/firms.ts`
Fetches active wildfire hotspots from NASA FIRMS. The API returns CSV — the key
is embedded directly in the URL path, no auth headers needed. Parse each CSV row
into a `PollutionPoint`. Cap at 50 hotspots for map performance. The FRP (fire
radiative power) column determines severity: above 100 = high, above 30 = medium.

### `services/openMeteo.ts`
Fetches PM2.5, NO2, and CO from the Open-Meteo air quality API. No API key
required — just a URL with lat/lon query params. Get the current hour's reading
from the hourly arrays. Return one `PollutionPoint` per pollutant. Skip any
pollutant where the value is zero or null.

Severity thresholds:
- PM2.5: above 35 µg/m³ = high, above 12 = medium
- NO2: above 200 µg/m³ = high, above 40 = medium
- CO: above 9 ppm = high, above 4 = medium

### `services/openWeather.ts`
Fetches the 4-day air quality forecast from OpenWeatherMap. Use this to show a
forecast badge on the detail sheet ("Air quality expected to worsen tomorrow").
The API key goes in the `appid` query parameter.

### `services/llm.ts`
Calls the LLM to generate a health briefing for a tapped hotspot. Use the OpenAI
SDK with `dangerouslyAllowBrowser: true` (required in Expo/React Native).

Currently configured for OpenAI (`gpt-4o-mini`). The file must include a clear
comment block explaining exactly how to switch to Featherless when credits arrive:
change the `apiKey` env var, add `baseURL: 'https://api.featherless.ai/v1'`, and
change the model to `meta-llama/Meta-Llama-3.1-70B-Instruct`. No other changes
are needed — the OpenAI SDK is fully compatible.

Parse the LLM response as JSON. If parsing fails, construct a fallback `AIBriefing`
from the raw text and derive urgency from the point's severity field.

### `services/cloudant.ts`
IBM Cloudant CRUD using the REST API with Bearer token auth. Implement:
- `saveReport` — POST a new `CitizenReport` document with a nanoid-generated `_id`
- `getReports` — GET all docs with `include_docs=true`, filter to type === 'report',
  return the most recent 30

Use `nanoid/non-secure` import path (required in React Native).

### `store/useFilterStore.ts`
Zustand store. Holds a `Set<LayerId>` of currently active layers. Default active:
methane, wildfire, pm25. Provide `toggleLayer`, `isActive`, and `activeLayers`.

### `store/useMapStore.ts`
Zustand store. Holds the currently selected `PollutionPoint | null` and the
current map region. Provide setters for both.

### `hooks/useMapData.ts`
TanStack Query hook. Consult the `native-data-fetching` skill for the correct
pattern. Query key includes lat/lon (rounded to 2dp) and the sorted active layers
string so it refetches when filters change. Calls the relevant services in parallel
using `Promise.allSettled` — one failing service should not block the others.
Refetch every 5 minutes. Only enabled when lat/lon are non-zero.

### `hooks/useAIExplanation.ts`
TanStack `useMutation` hook that calls `services/llm.ts`. Takes a `PollutionPoint`
and returns an `AIBriefing`.

### `hooks/useUserLocation.ts`
Wraps `expo-location`. Requests foreground permission, gets current position.
Default to Toronto (43.7, -79.42) if permission is denied or unavailable.

### `hooks/useReports.ts`
TanStack Query for reading reports from Cloudant. Mutation for saving a new report
with optimistic update so it appears in the list instantly. Follow the
`native-data-fetching` skill patterns for cache invalidation.

---

## Components

Apply the `building-native-ui` and `vercel-react-native` skills to every component.
Every interactive element should feel native — spring physics, haptic feedback,
smooth transitions. Consult `vercel-web-design` and `enhance-prompt` for visual
decisions.

### `FilterChip`
A pill-shaped toggle button. When active: filled background and border in the
layer's color at reduced opacity, label text in the layer's color. When inactive:
dimmed to ~40% opacity. Fire haptic feedback on press.

### `FilterBar`
Horizontally scrollable row of `FilterChip` components. Fixed position over the
map near the bottom. All five layers always shown.

### `HotspotMarker`
A `react-native-maps` Marker with a custom view — an outer ring (the layer color
at low opacity) and a filled inner circle. Size the circle based on severity:
high = large, medium = medium, low = small. Set `tracksViewChanges={false}` for
map performance (this is critical — see pitfalls below). Fire medium haptic on press.

### `DetailSheet`
A `@gorhom/bottom-sheet` that opens when a hotspot is tapped. Shows:
- Layer name in the layer's color
- Current value + unit in large text
- `SeverityBadge` showing Safe/Caution/Avoid
- While AI is loading: a loading spinner in the layer color
- When AI resolves: the explanation paragraph, then an "action" card below it
- Closes when user swipes down, which clears the selected point in the store

### `SeverityBadge`
A small pill with background and text in the appropriate urgency color. Text is
"Safe", "Caution", or "Avoid".

### `LoadingPulse`
Animated skeleton placeholder. Use Reanimated to pulse opacity on a loop. Consult
the `building-native-ui` skill for the correct Reanimated entering/exiting pattern.
Use wherever data is loading.

### `ReportForm`
A form with: layer picker (dropdown of layer IDs), severity picker (low/medium/high),
description text input, and submit button. On submit call `useReports` mutation.
Show a success toast on save.

---

## Screens

### Map screen (`app/(tabs)/index.tsx`)
Full-screen `MapView` with `mapType="hybridFlyover"` on iOS. Render all
`PollutionPoint` items from `useMapData` that belong to an active layer as
`HotspotMarker` components. Show `FilterBar` overlaid near the bottom. Show
`DetailSheet` anchored to the bottom — it opens when a marker is tapped. Show a
loading indicator while data fetches. Show an error state if all sources fail.

### Reports screen (`app/(tabs)/reports.tsx`)
A scrollable list of `CitizenReport` items from Cloudant, most recent first.
Each row shows layer badge, description, severity, and relative timestamp. A
floating action button opens the `ReportForm` in a modal.

### About screen (`app/(tabs)/about.tsx`)
Static screen listing all data sources with their names, what they provide, and
their URLs. Credit ESA/Copernicus, NASA FIRMS, Open-Meteo, OpenWeatherMap. Mention
IBM Cloudant for citizen reports and the hackathon context.

### Root layout (`app/_layout.tsx`)
Wrap the entire app in:
1. `GestureHandlerRootView` (required by bottom sheet and gesture handler)
2. `QueryClientProvider` with a new `QueryClient`
3. `BottomSheetModalProvider`

Then render a `Stack` with `headerShown: false`.

### Tab layout (`app/(tabs)/_layout.tsx`)
Dark tab bar. Active tint: teal `#1D9E75`. Inactive: 40% white. Tab bar background
`#161b22`, top border at 10% white opacity. Icons: earth (map), flag-outline
(reports), information-circle-outline (about).

---

## Design rules

Apply the `vercel-web-design`, `enhance-prompt`, and `design-md` skills when
making visual decisions. Core rules:

- Everything dark. Background `#0d1117`, cards `#161b22`. No light backgrounds.
- Layer colors are the only saturated colors — used sparingly for markers, filter
  chips, and badges only. Everything else is white at varying opacities.
- No custom fonts. Use the system font (San Francisco on iOS, Roboto on Android).
- Map is always full screen — UI chrome floats over it, never pushes it.
- Bottom sheet must feel native — spring animation, pan gesture, momentum.
- Filter chips must feel tactile — haptic on every toggle.

---

## Error handling rules

- Every service call is wrapped in try/catch and returns an empty array on failure
  rather than throwing — one bad source should never crash the whole map
- `useMapData` uses `Promise.allSettled` for this reason
- If the LLM call fails, show a fallback briefing derived from the severity field
- If location permission is denied, silently fall back to Toronto coordinates
- If Cloudant is unreachable, show a toast but still allow viewing the map

---

## Coding conventions

Apply the `typescript-magician` skill throughout.

- TypeScript strict mode — no `any`, no non-null assertions unless absolutely
  necessary with a comment explaining why
- No `fetch` calls inside components — all network calls go through `services/`
- No `useState` + `useEffect` for data fetching — use TanStack Query exclusively
- Zustand only for UI state (filters, selected point) — not for server data
- All env vars prefixed `EXPO_PUBLIC_` and accessed via `process.env`
- Layer colors and IDs from `constants/layers.ts` only — never hardcoded
- Design tokens from `constants/theme.ts` only

---

## Common pitfalls to avoid

- `@gorhom/bottom-sheet` requires both `GestureHandlerRootView` and
  `BottomSheetModalProvider` in the root layout or it will crash
- `react-native-reanimated`'s Babel plugin must be the last entry in the plugins
  array or the app will throw on startup
- NASA FIRMS CSV rows can contain empty lines — filter them before parsing
- The Copernicus token is only valid for ~600 seconds — always check expiry before
  making a request, never assume the token is still valid
- Open-Meteo hourly arrays are indexed by hour — find the current hour's index
  rather than always using index 0
- Set `tracksViewChanges={false}` on all `Marker` components or the map will
  re-render every frame and drop to single-digit fps
- `nanoid` in React Native requires the `nanoid/non-secure` import path