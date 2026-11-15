<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Agent & Architecture Rules — «Вердуны там: Энхийн үнэ цэнэ»

## 1. Project Identity & Purpose
- **Exhibition Title:** «Вердуны там: Энхийн үнэ цэнэ» (Дэлхийн I дайны дижитал музейн үзэсгэлэн)
- **Primary Source of Truth:** [`public/Вердуны Тулалдааны Дижитал Үзэсгэлэнгийн Судалгаа.pdf`](public/Вердуны%20Тулалдааны%20Дижитал%20Үзэсгэлэнгийн%20Судалгаа.pdf)
- **Language:** Mongolian (Cyrillic) UI and curatorial copy, preserving authentic French/German historical terms and proper names (e.g., *La Voie Sacrée*, *Citadelle souterraine*, *Villages détruits*, *Zone Rouge*, *Ossuaire de Douaumont*, *Tranchée des Baïonnettes*, *Trommelfeuer*, *«On ne passe pas!»*).

## 2. Tech Stack & Runtime Rules
- **Framework:** Next.js `16.4.6` (App Router) with `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`.
- **UI & Styling:** React `19.3.0`, TypeScript `5`, Tailwind CSS `4.3.3` (`@tailwindcss/turbopack`).
- **Cache Components Discipline:**
  - Never call uncached `new Date()`, `Date.now()`, `Math.random()`, or `crypto.randomUUID()` inside Server Components during prerendering.
  - Keep domain data pure, deterministic, and static-importable.
  - Push interactive browser APIs (`window.speechSynthesis`, scroll observers, interactive map pan/zoom, audio timers) strictly into leaf `'use client'` components.

## 3. Clean Architectural Boundaries
Follow a strict separation of concerns across directories:
- `types/` — Domain TypeScript contracts (`exhibition.ts`). No JSX, no runtime side effects.
- `data/verdun/` — Pure, typed curatorial datasets derived 1:1 from the research PDF (`meta.ts`, `panels.ts`, `coordinates.ts`, `timeline.ts`, `villages.ts`, `statistics.ts`, `guide.ts`, `assets.ts`, `citations.ts`, `index.ts`).
- `lib/` — Pure domain helpers and audio engine (`cartography.ts`, `format.ts`, `ambientMusic.ts` Web Audio memorial elegy synthesizer).
- `components/` — Modular UI grouped by feature domain:
  - `components/gallery/` — Minimalist full-viewport Museum Gallery / Presentation Room architecture (`ExhibitionGallery`, `GalleryRoomView`, `SlideMapStage`, `AmbientMusicControl`, `Icons`). No long vertical scrolling, no spoken narrator/TTS guide (presenter narrates live).
- `app/` — Route composition, global styles (`globals.css`), fonts (`layout.tsx`), and server-rendered exhibition orchestration (`page.tsx`).

## 4. Historical Accuracy & Historiographical Rules
- **Never collapse competing scholarly estimates into a single unqualified number.** Always present both official museum/memorial figures and historian/encyclopedia estimates side by side (e.g., `700,000+` vs. `714,000` Philpott vs. `~750,000` Britannica; `302 days` leap-year exact count vs. traditional `«300 өдөр, 300 шөнө»` / `303 хоног`; `23M` German shells vs. `40–60M` combined estimate).
- **Preserve documented historiographical caveats:**
  - Erich von Falkenhayn's «Christmas Memorandum» (*attrition / "bleed white"*) authenticity debate (Holger Afflerbach et al.).
  - Absence of separate official civilian death counts for Verdun 1916 despite full evacuation, 2,305 destroyed residential buildings, and 9 obliterated villages.
  - Bayonet Trench (*Tranchée des Baïonnettes*) legend vs. post-war excavation reality (21 bodies found: 14 identified/reburied, 7 unknown left in situ).

## 5. Copyright, Licensing & Archival Asset Rules
- **Local Public-Domain / CC Assets (`public/archive/`):** Only embed locally stored Wikimedia Commons / Library of Congress public-domain or CC-licensed assets that are verified and explicitly attributed with year, title, license, and source URL.
- **Douaumont Ossuary Architectural Copyright Rule:** Because the modern Ossuaire de Douaumont building carries architectural copyright restrictions, only use historical 1916–1921 postcards, *de minimis* cemetery views, tower perspective photos, or 1914-1918-online / Wikimedia Commons verified files.
- **1984 & 2016 Reconciliation Press/Government Photos:** Do **not** scrape or embed copyrighted AFP/Getty/Reuters or modern government press photographs; instead render editorial archival reference cards linking directly to the official sources (Bundesregierung, European Union, The Guardian, INA/LeMO, RFE/RL).

## 6. Verification Checklist Before Completion
- `npx next typegen` & `npx tsc --noEmit` pass with zero TypeScript errors.
- `npm run lint` passes with zero errors or unused imports.
- `npm run build` succeeds cleanly with `cacheComponents: true`.
- Visual & functional inspection in a real browser (desktop + mobile widths, map interactions, panel tabs, audio guide playback/scrubber, no broken images).
