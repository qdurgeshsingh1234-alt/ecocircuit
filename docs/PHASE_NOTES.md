# EcoCircuit — Phase Notes

Project notes and viva explanations for each verified roadmap stage of EcoCircuit (CHE110 Environmental Studies).

---

## Stage A: Tailwind & File Integrity

1. **What it does:** Ensures Tailwind CSS v4 compiles utility classes reliably across the entire web application and strips invisible UTF-8 Byte Order Marks (BOMs) from all source files so Node.js and TypeScript parsers run without syntax errors.
2. **How it works:** Tailwind CSS v4 integrates directly into Vite using the `@tailwindcss/vite` plugin and `@import "tailwindcss";` in `client/src/index.css`, dynamically applying design system color tokens and typography declared in `@theme` without needing a legacy `postcss.config.js`.
3. **Important files:** `client/vite.config.ts` (Tailwind Vite plugin configuration), `client/src/index.css` (Tailwind v4 entry and design system CSS custom properties), `client/src/main.tsx` (CSS root import).
4. **How it was tested:** All 1,078 files were scanned to confirm zero 0-byte and zero BOM files exist; verified Tailwind utility compilation by rendering a temporary red proof box (`bg-red-600 text-white p-6 font-bold text-center`) on the live browser and capturing Playwright screenshots at 1440px and 375px before cleanly restoring the landing page.
5. **Remaining limitations:** The sticky canvas narrative overlay on the landing page slightly overlaps the hero action buttons on narrow 375px mobile viewports, which is scheduled for remediation in Stage B.

---

## Stage B: Landing-Page Scroll Animation (`/`)

1. **What it does:** Renders a high-performance 198-frame scroll-scrubbed canvas animation illustrating an electronic device (laptop) teardown on the landing hero, communicating the recoverable materials and environmental urgency of e-waste recycling.
2. **How it works:** Loads 198 lightweight JPG frames (`/frames/ezgif-frame-001.jpg`..`198.jpg`) into memory, draws each frame to an HTML5 canvas scaled for high-DPI screens based on scroll distance, and displays synchronized story beat cards using brand color tokens (`#14170F`, `#F4F1E9`, `#2F4E3A`, `#B5652D`, `#E4DCC6`, `#6B8F71`).
3. **Important files:** `client/src/components/ScrollCanvasAnimation.tsx` (canvas rendering engine, story beat synchronization, preload progress, and responsive layout logic), `client/src/pages/Landing.tsx` (sticky hero container and CTA layout), `client/public/frames/` (198 optimized 768x768 JPG frames).
4. **How it was tested:** Verified that all 198 frames return HTTP 200 with zero failures; verified zero console errors; captured Playwright screenshots at 1440px desktop across 0%, 25%, 50%, 75%, and 100% scroll progress; and proved on 375px mobile that the narrative card no longer collides with the primary CTA buttons at 0% scroll.
5. **Remaining limitations:** Mobile users with reduced motion or bandwidth restrictions receive a static frame, though further bandwidth optimizations (e.g. WebP format) could be considered in future production iterations.

---

## Stage C: LPU Content, Shared Categories & Dead File Cleanup

1. **What it does:** Re-grounds all copy and data strictly around Lovely Professional University (LPU) and the Phagwara/Jalandhar area, unifying categories into 7 official CPCB slugs and removing legacy NCR/doorstep phrasing.
2. **How it works:** Shares canonical slugs (`it-equipment`, `mobiles-accessories`, `batteries`, `large-appliances`, `small-appliances`, `lighting`, `cables-peripherals`) between client and server, seeding 8 sample drop-off and recycler points with verified coordinates.
3. **Important files:** `client/src/data/categories.ts` (canonical client dataset), `server/src/categories.ts` (server mirror), `server/src/seed.ts` (8 LPU-grounded sample centers).
4. **How it was tested:** Deleted orphaned `ewasteCategories.ts`, verified exact string matching for all 7 slugs, and ran automated whole-word regex scans confirming 0 matches for Delhi, NCR, or doorstep.
5. **Remaining limitations:** Center records are hardcoded sample prototypes for academic evaluation and do not represent active commercial logistics contracts.

---

## Stage D: Disposal & Verification Guide (`/guide`)

1. **What it does:** Provides an instant searchable catalog of 36 campus items, a 7-step pre-disposal checklist, battery safety protocols, and deep links to campus collection points and hostel pickups.
2. **How it works:** Replaces gimmick 3D tilt and specular glare animations with tactile editorial cards adhering strictly to the "circuit meets soil" palette (`#14170F`, `#F4F1E9`, `#2F4E3A`, `#B5652D`, `#E4DCC6`, `#6B8F71`, `#9B4A3E`); live query filters match item names and aliases with deep links carrying category slugs.
3. **Important files:** `client/src/pages/Guide.tsx` (guide lookup engine, editorial card layout, sticky pre-disposal checklist, battery protocol), `client/src/data/guideItems.ts` (36 catalog items with disposal protocols).
4. **How it was tested:** Executed live browser evaluation testing keyword search ("phone"), filter chips, and deep link generation (`/centers?category=mobiles-accessories` and `/pickup?category=mobiles-accessories`); captured desktop 1440px and mobile 375px screenshots; confirmed 0 console errors and 0 BOM files.
5. **Remaining limitations:** The pre-disposal checklist status is stored locally in React component state rather than saved persistently across user sessions.

---

## Stage E: Collection Centers & Interactive Campus Map (`/centers`)

1. **What it does:** Shows verified campus drop-off bins and regional e-waste recyclers near Lovely Professional University on an interactive OpenStreetMap with category filtering and distance sorting.
2. **How it works:** Uses Leaflet with brand-colored DivIcon SVGs (`#2F4E3A`, `#B5652D`, `#14170F`) without PNG asset dependencies; synchronizes state bidirectionally between markers and list cards; filters by category via URL query parameters (`?category=`); calculates distance from LPU campus center (`31.255° N, 75.705° E`); and generates Google Maps directions links.
3. **Important files:** `client/src/pages/Centers.tsx` (bidirectional map and list layout, Haversine distance calculator, Leaflet controller, and filter system), `server/src/routes/centers.ts` (backend query API).
4. **How it was tested:** Navigated to `/centers?category=batteries`, verified that 7 battery collection points rendered with exact distance sorting, validated Google Maps routing URLs and OSM attribution, and captured 1440px desktop and 375px mobile screenshots without console errors.
5. **Remaining limitations:** Live GPS geolocation requires HTTPS/browser user permission; by default, distance calculation centers on LPU campus center coordinates.

---

## Stage F: Hostel Collection Request Wizard (`/pickup`)

1. **What it does:** Enables LPU students and staff to request scheduled hostel or departmental e-waste collections, validating 10-digit phone numbers and generating a canonical tracking ID (`ECO-XXXXXX`).
2. **How it works:** Uses a 5-step guided wizard (Categories, Quantity, Campus Location, Contact, Review) with real-time environmental impact calculations grounded in GEM 2024 baseline unit weights; submits via `POST /api/pickups`; renders a confirmation screen with one-click clipboard copy and deep links to `/dashboard?email=...`.
3. **Important files:** `client/src/pages/Pickup.tsx` (multi-step wizard, impact estimator, confirmation state), `server/src/routes/pickups.ts` (validation schema, impact formulas with documented assumptions, `ECO-XXXXXX` generator), `server/src/seed.ts` (sample pickups).
4. **How it was tested:** Walked through the live browser flow across all 5 wizard steps, submitted a test request with valid 10-digit phone number, verified the HTTP 201 response, validated that the generated tracking ID matched `/^ECO-[A-Z0-9]{6}$/`, and captured desktop (1440px initial & confirmation) and mobile (375px) screenshots.
5. **Remaining limitations:** SMS confirmation gateway integration is simulated; confirmation details are delivered in-app on the final screen and queryable via dashboard.

---

## Stage G: User Impact Dashboard (`/dashboard`)

1. **What it does:** Displays personalized recycling statistics, historical pickup requests, and an environmental impact bar chart for any student or staff email address.
2. **How it works:** Persists the active lookup email in `sessionStorage` and synchronizes with URL search parameters (`?email=`); fetches records from `GET /api/pickups?email=...`; aggregates total kilograms diverted and CO2 emissions avoided; renders a Recharts bar chart styled with brand palette tokens (`#2F4E3A`, `#B5652D`, `#6B8F71`, `#9B4A3E`); and features a "Switch Email" button and sample presets.
3. **Important files:** `client/src/pages/Dashboard.tsx` (dashboard view, Recharts bar graph, metric cards, session persistence), `server/src/routes/pickups.ts` (email query endpoint).
4. **How it was tested:** Verified lookup for `sample.student1@lpu.in` via URL query param and form submission, validated that 3 pickup records and 3 chart bars rendered, confirmed session persistence across page refreshes, and captured desktop (1440px) and mobile (375px) screenshots without console errors.
5. **Remaining limitations:** No password authentication is required for lookup, operating as an open student prototype lookup system.





