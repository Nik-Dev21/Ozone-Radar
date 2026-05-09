# CLAUDE.md — OzoneRadar

> Quick reference for Claude Code. Full build instructions are in `OZONERADAR_CLAUDE_CODE_INSTRUCTIONS.md`.

---

## What this app is

Real-time environmental pollution map (Expo Go). Users see live layers — methane, NO2, PM2.5, CO, wildfire — tap any hotspot for an AI health briefing. Citizens submit reports stored in IBM Cloudant.

**Hackathon:** IBM Z × Sheridan · **Track:** Sustainability · **UN Goals:** SDG 13 + SDG 11

---

## Key files

| File | Purpose |
|---|---|
| `OZONERADAR_CLAUDE_CODE_INSTRUCTIONS.md` | Full build instructions — what to build and why |
| `TERRAWATCH_API_SETUP.md` | How to get every API key + curl tests |
| `.env.example` | All env var names with signup links |
| `setup-skills.sh` | Downloads all skills into `.agent/skills/` |
| `constants/layers.ts` | Layer IDs, colors, units — source of truth |
| `constants/theme.ts` | All design tokens (dark palette) |
| `services/types.ts` | All shared TypeScript interfaces |

---

## Skills

Skills live in `.agent/skills/<skill-name>/SKILL.md`. Run `bash setup-skills.sh` to install them. Read all skills before writing any code.

| Skill folder | Source | What it teaches |
|---|---|---|
| `building-native-ui` | expo/skills | Expo Router, Reanimated, Apple HIG, SF Symbols, dark UI patterns |
| `native-data-fetching` | expo/skills | TanStack Query, caching, error handling, offline patterns |
| `expo-tailwind-setup` | expo/skills | NativeWind v5 + Tailwind v4 config |
| `upgrading-expo` | expo/skills | SDK migrations, New Architecture, deprecated API warnings |
| `vercel-react-native` | vercel-labs/agent-skills | FlashList, Reanimated GPU props, Pressable, performance rules |
| `vercel-react-practices` | vercel-labs/agent-skills | Component architecture, memoization, composition patterns |
| `vercel-web-design` | vercel-labs/agent-skills | Design vocabulary, visual hierarchy, spacing, dark themes |
| `typescript-magician` | mcollina/skills | Strict TypeScript, no `any`, type guards, complex generics |
| `node-best-practices` | mcollina/skills | Async error handling, graceful shutdown, service patterns |
| `enhance-prompt` | google-labs-code/stitch-skills | UI/UX vocabulary, design system tokens, atmosphere keywords |
| `design-md` | google-labs-code/stitch-skills | Design system documentation, DESIGN.md authoring |

---

## Stack at a glance

- **Framework:** Expo SDK 52 + React Native, Expo Go compatible
- **Navigation:** Expo Router (file-based)
- **Map:** `react-native-maps`
- **State:** Zustand (UI) + TanStack Query v5 (async data)
- **Styling:** NativeWind v4 (Tailwind)
- **Animations:** Reanimated 3 + `@gorhom/bottom-sheet`

---

## Data sources

| Layer | Service | Notes |
|---|---|---|
| Methane + NO2 + CO | ESA Copernicus Sentinel-5P | OAuth token expires every 10 min — auto-refresh in `services/copernicus.ts` |
| Wildfire | NASA FIRMS | Key in URL, no auth header |
| PM2.5, NO2, CO, SO2 | Open-Meteo | No API key needed |
| AQ forecast | OpenWeatherMap | `appid` query param |
| AI briefings | OpenAI → Featherless (when credits arrive) | See switching note below |
| User reports | IBM Cloudant | Always-free Lite, `Bearer` token auth |

---

## LLM switch (OpenAI → Featherless)

When Featherless credits arrive, edit `services/llm.ts` — 3 lines:
```
apiKey  →  EXPO_PUBLIC_FEATHERLESS_API_KEY
baseURL →  https://api.featherless.ai/v1
model   →  meta-llama/Meta-Llama-3.1-70B-Instruct
```

---

## Conventions

- No `any`, no raw `fetch` in components, all async via TanStack Query
- `EXPO_PUBLIC_` prefix on all env vars
- Dark map-first UI — background `#0d1117`, surface `#161b22`
- Layer colors defined in `constants/layers.ts` — never hardcode elsewhere
- Design tokens from `constants/theme.ts` only