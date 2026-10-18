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

1. **What it does:** Re-grounds all copy and data strictly around Lovely Professional University (LPU) and the Phagwara/Jalandhar area, unifying categories into 7 official CPCB slugs and removing legacy non-LPU regional phrasing.
2. **How it works:** Shares canonical slugs (`it-equipment`, `mobiles-accessories`, `batteries`, `large-appliances`, `small-appliances`, `lighting`, `cables-peripherals`) between client and server, seeding 8 sample drop-off and recycler points with verified coordinates.
3. **Important files:** `client/src/data/categories.ts` (canonical client dataset), `server/src/categories.ts` (server mirror), `server/src/seed.ts` (8 LPU-grounded sample centers).
4. **How it was tested:** Deleted orphaned `ewasteCategories.ts`, verified exact string matching for all 7 slugs, and ran automated whole-word regex scans confirming 0 matches for non-LPU regional or legacy collection terms.
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

---

## Stage H: Demo Administration Portal (`/admin`)

1. **What it does:** Provides a collector administration interface for LPU campus collectors to inspect, filter, and advance pickup request statuses (`Requested → Scheduled → Collected`).
2. **How it works:** Removes gimmick PIN entry gates in favor of an unauthenticated demonstration interface prominently labeled with a "Demo-Only Administration Interface" banner; executes optimistic status updates via `PATCH /api/pickups/:id`; provides real-time search across tracking IDs, campus hostels, and contact names; and renders a responsive table on desktop and compact cards on mobile.
3. **Important files:** `client/src/pages/Admin.tsx` (collector table, status mutation triggers, search & filter controls, mobile cards), `server/src/routes/pickups.ts` (`PATCH /:id` status transition endpoint).
4. **How it was tested:** Navigated to `/admin` to verify immediate table rendering without authentication prompts, executed status mutation from `requested` to `scheduled` and verified instant UI state update and backend confirmation, and captured desktop (1440px) and mobile (375px) screenshots without console errors.
5. **Remaining limitations:** Prototype is intentionally unauthenticated for academic assessment; production deployment would require JWT tokens, session cookies, and role-based access control (RBAC).

---

## Stage I: Final Verification & Repository Integrity

1. **What it does:** Completes exhaustive end-to-end audit, comprehensive documentation, and builds of both client and server applications for academic grading and presentation.
2. **How it works:** Enforces the "circuit meets soil" design system across all 6 application routes; documents United Nations GEM 2024 calculation formulas in code comments; validates `ECO-XXXXXX` tracking ID formats; updates `README.md` with full route breakdowns and Windows PowerShell setup instructions; and verifies that 0 files contain UTF-8 BOMs, 0 files have 0-byte size, and 0 matches exist for legacy non-LPU regional or collection terminology.
3. **Important files:** `README.md` (comprehensive documentation, route breakdowns, and viva guide), `docs/PHASE_NOTES.md` (plain-English viva explanations for Stages A through I), `docs/screenshots/` (genuine Playwright desktop and mobile evidence).
4. **How it was tested:** Executed full Vite client build and TypeScript server compilation with 0 errors; ran automated whole-repo filesystem scans for BOMs, zero-byte files, and forbidden words; verified via Playwright that all 6 routes render with 0 console errors.
5. **Remaining limitations:** Live production logistics, physical electronic weighing scales, and SMS OTP authentication gateways are simulated for prototype evaluation purposes.

---

## Stage J: Ultra UI/UX Overhaul, 3D Tactile Hardware Design & Auth Restoration

1. **What it does:** Elevates the entire user experience into a tactile "3D Circuit Meets Soil" hardware aesthetic, repairs header gradient defects, adds a decorative circuit-root telemetry footer, expands `/guide` and `/centers` into commanding wide-screen layouts, and restores the 3D Hardware PIN Authentication Gate (`2026`) on `/admin`.
2. **How it works:** Implements organic 3D isometric card lift, mechanical key press physics, and PCB background patterns in `client/src/index.css`; upgrades `Nav.tsx` to a full-width adaptive bar with a centered tactile pill dock, rotating 3D hexagonal leaf logo, and 3D copper CTA; renders animated SVG circuit roots and an active LPU drop-off telemetry bar in `Footer.tsx`; replaces `/guide` narrow columns with a 3-card horizontal safety bento banner and a full-width 3-column item grid; overhauls `/centers` into a 12-column command center with a tall sticky map and real-time GPS telemetry HUD; and implements `AdminPinGate` with 4 corner copper rivets, 4 digital LED PIN slots, and interactive mechanical keypad with terminal relock capability.
3. **Important files:** `client/src/index.css` (3D hardware animations & tactile physics), `client/src/components/Nav.tsx` (adaptive navbar & unified dock), `client/src/components/Footer.tsx` (circuit-root divider & telemetry bar), `client/src/pages/Guide.tsx` (wide bento & 3-column grid), `client/src/pages/Centers.tsx` (12-col command center & telemetry HUD), `client/src/pages/Admin.tsx` (3D mechanical PIN gate & terminal lock).
4. **How it was tested:** Built client production bundle with `npm --prefix client run build` confirming 0 TypeScript errors; verified with Playwright at 1440px desktop and 375px mobile viewports; verified interactive PIN gate unlocking with code `2026` and immediate relocking via "Lock Terminal"; confirmed `/` scroll-canvas frame animation remains 100% intact; and captured authentic screenshots saved to `docs/screenshots/`.
5. **Remaining limitations:** PIN `2026` is a client-validated demonstration credential designed for evaluator accessibility and automated tests; real-world deployment would link with LPU single sign-on (SSO) or institutional LDAP.

---

## Stage K: Argon Overdrive UI/UX Redesign — Cursor Spotlight, Hover-Reveal Color-Coded Tiles, Sticky Zero-Scrollbar Centers & Admin Dispatch Board

1. **What it does:** Solves layout and visual clutter by introducing sleek custom scrollbars, a cursor-tracking ambient spotlight background, color-coded item and hazard cards with hover-reveal drawers, an interactive 3D Device X-Ray Spec Modal, a scrollbar-free natural page flow for `/centers` with a sticky map, and a dual-mode Hostel Collection Dispatch Board (`Tickets Grid` vs `Kanban Pipeline`) on `/admin`.
2. **How it works:**
   - Adds custom sleek scrollbars (`::-webkit-scrollbar` with dark `#14170F` tracks and Moss-to-Copper thumb gradients) and high-contrast color tokens in `client/src/index.css`.
   - Implements global interactive cursor spotlight tracking via `mousemove` in `client/src/App.tsx` updating CSS variables `--mouse-x` and `--mouse-y` for `.interactive-spotlight-bg`.
   - Upgrades `client/src/components/Nav.tsx` to an island floating dock (`fixed top-3 inset-x-0 z-50 pointer-events-none`, inner dock `max-w-[1380px] bg-[#14170F]/95 backdrop-blur-xl border border-[#F4F1E9]/15 shadow-2xl pointer-events-auto`) with glowing emerald active pill and zero gray background bleed.
   - Redesigns `client/src/pages/Guide.tsx` with 4 color-coded surface themes (`.theme-card-hazard`, `.theme-card-emerald`, `.theme-card-copper`, `.theme-card-slate`), hover-reveal drawer panels (`group-hover:translate-y-0`), interactive 3D Device X-Ray Spec Modal with interactive preparation checklists, and a compact 3-pill Golden Rules ribbon with hover tooltips.
   - Overhauls `client/src/pages/Centers.tsx` by removing the nested inner scrollbar on the left column (flows naturally with window scroll), keeping the right column sticky (`sticky top-24 h-[calc(100vh-7.5rem)]`), and adding live `● OPEN NOW` emerald pulse badges.
   - Upgrades `client/src/pages/Admin.tsx` with a Tactile Dispatch Board supporting instant toggling between `Tickets Grid` and `Kanban Pipeline` views, color-coded status banners, monospace tracking badges (`ECO-XXXXXX`), student contact chips, and 3-step pipeline action buttons, while preserving the 3D Hardware PIN Gate (`2026`).
3. **Important files:** `client/src/index.css` (custom scrollbars, cursor spotlight, color-coded card themes), `client/src/App.tsx` (cursor mousemove tracker), `client/src/components/Nav.tsx` (floating dock navbar), `client/src/pages/Guide.tsx` (hover-reveal cards, 3D spec modal, golden rules ribbon), `client/src/pages/Centers.tsx` (scrollbar-free left column, sticky map), `client/src/pages/Admin.tsx` (dispatch board with Tickets Grid & Kanban Pipeline).
4. **How it was tested:** Built client production bundle with `npm --prefix client run build` with 0 errors; launched Playwright to verify clean visual rendering across `/guide`, `/centers`, `/admin`, and `/` at 1440px desktop; tested interactive modal checklist, Quick Unlock PIN gate, and Kanban view switching; confirmed zero console errors; verified whole-repository BOM and zero-byte cleanliness; and captured full-resolution screenshots in `docs/screenshots/stage_k_*.png`.
5. **Remaining limitations:** Live production routing, physical electronic weighing scales, and SMS OTP authentication gateways are simulated for prototype evaluation purposes.

---

## Stage L: Global Simplex-Noise Wave Background, Landing Page Polish, Ultra-Clean Collector Command Strips & 12-Column Pickup Configurator

1. **What it does:** Introduces a living 60fps simplex-noise topographic wave background globally across all routes, enhances hero canvas blending with cinematic edge vignettes, redesigns `/admin` with generous top spacing (`pt-28`) and sleek 12-column horizontal Command Strips featuring a unified 3-way status segmented dock, and transforms `/pickup` into a commanding 12-column interactive 3D hardware configurator with accurate hazard badges and a sticky live UN GEM 2024 environmental impact sidebar.
2. **How it works:**
   - Installs `simplex-noise` and creates `client/src/components/ui/wave-background.tsx` with dynamic cursor tracking, ambient halo, and copper/emerald wave lines.
   - Mounts `<Waves />` globally in `client/src/App.tsx` and ensures all interior page containers render with transparent backgrounds so the living waves shine through.
   - Adds cinematic left, right, and bottom vignette gradient overlays in `ScrollCanvasAnimation.tsx` so the laptop animation seamlessly blends into the dark hero without harsh vertical cutoffs, and layers `<Waves variant="dark" />` behind the hero canvas.
   - Upgrades `Admin.tsx` with `pt-28` top padding to eliminate navbar overlap, a 4-card Executive Telemetry Ribbon, and full-width `DispatchCommandStrip` cards with a unified 3-way segmented control dock (`Requested | Scheduled | Collected ✓`).
   - Overhauls `Pickup.tsx` into a wide 12-column split layout (`lg:col-span-8` configurator deck, `lg:col-span-4` sticky telemetry receipt sidebar):
     - Displays accurate regulatory hazard badges (`🔥 High Lithium Hazard`, `⚠️ Mercury Vapor Risk`, `🔒 Data & Lead Solder`, `💎 Precious Metals & Li-Ion`, `❄️ Heavy / Refrigerant`, `♻️ Mixed Polymer & Copper`, `⚡ High Copper Yield`).
     - Includes full untruncated example items, average masses, interactive quantity tiers with weight bars, quick campus zone pills, and a one-click `"Fill Demo Student"` helper.
     - Automatically recalculates live e-waste mass, CO₂e avoided, and diverted heavy metals according to United Nations GEM 2024 standards.
     - Renders a perforated 3D E-Waste Dispatch Boarding Pass upon submission.
3. **Important files:** `client/src/components/ui/wave-background.tsx` (simplex-noise wave component), `client/src/App.tsx` (global background mounting), `client/src/components/ScrollCanvasAnimation.tsx` (cinematic vignettes & upgraded story beat cards), `client/src/pages/Landing.tsx` (hero waves & tactile action cards), `client/src/pages/Admin.tsx` (command strips & 3-way segmented dock), `client/src/pages/Pickup.tsx` (12-column hardware configurator & sticky telemetry sidebar).
4. **How it was tested:** Built client production bundle with `npm --prefix client run build` confirming 0 TypeScript errors; verified with Playwright across `/`, `/pickup`, `/admin`, and `/dashboard` at 1440px desktop; tested interactive status transition via the 3-state switcher; confirmed 0 console errors; verified repository BOM and zero-byte cleanliness; and captured full-resolution screenshots in `docs/screenshots/stage_l_*.png`.
5. **Remaining limitations:** Physical scale readings, real-time collector GPS tricycles, and live SMS gateways remain simulated for academic demonstration.

---

## Stage M: Submerged Silk-Circuit Wave Redesign & Landing Page Contrast Overhaul

1. **What it does:** Solves visual contrast and canvas edge artifacts by overhauling the interactive background into a high-performance Canvas 2D submerged "silk-circuit" mesh, feathering the hero laptop canvas with an elliptical radial mask and studio ambient glow, guaranteeing 100% dark-on-light contrast across below-the-fold content, redesigning "How EcoCircuit Works" into a 4-column editorial tactile card grid (`01`–`04`), and resolving 375px mobile hero spacing.
2. **How it works:**
   - **Submerged Silk-Circuit Canvas (`wave-background.tsx`):**
     - Replaces heavy SVG paths with a High-DPI Canvas 2D engine running locked at 60fps.
     - Spaced horizontal silk ribbons (`xGap = 40`, `yGap = 22`) with low spatial simplex-noise frequency (`0.0012`) and delicate stroke (`lineWidth = 0.75`, `alpha = 0.045`).
     - Instant magnetic mouse response (`0.65` wave displacement lerp, `0.85` glow lerp) eliminating lag; removes the solid orange pointer dot in favor of an ambient radial proximity spotlight (`260px`).
     - Dynamically brightens lines (`alpha` up to `0.18`) with alternating Copper (`#B5652D`) and Moss (`#2F4E3A`) strokes and illuminates `1.5px` micro-circuit nodes along every 5th vertex inside cursor proximity.
   - **Hero Canvas Feathering & High Contrast Text (`ScrollCanvasAnimation.tsx` & `Landing.tsx`):**
     - Embeds a studio ambient glow (`[radial-gradient(ellipse_at_center,rgba(181,101,45,0.2)_0%,rgba(47,78,58,0.14)_45%,rgba(20,23,15,0)_75%)]`) behind the teardown animation.
     - Applies an elliptical radial CSS mask (`mask-image: radial-gradient(ellipse 48% 56% at 50% 50%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 70%)`) to seamlessly feather rectangular frame seams into the `#14170F` background without altering 198-frame scroll scrubbing.
     - Upgrades hero left typography with explicit `#F4F1E9` headline, `#B5652D` accent, and `#E4DCC6` subheadings/badges.
   - **Zero Black-on-Black Contrast & 4-Column Editorial Card Grid:**
     - Scopes dark `#14170F` strictly to Hero sticky container and bottom CTA strip; scopes `GlobalBackground` to `#EFECE2` warm paper so below-the-fold content sections have razor-sharp dark-on-light contrast (`#14170F` Ink text on `#FAF8F3`/`#F4F1E9` paper).
     - Styles Stats strip as a commanding dark architectural container (`bg-[#14170F] text-[#F4F1E9] border-y border-[#B5652D]/30`) badged `"Sample Campus Projections & Global Context"`.
     - Rewrites `HowItWorksTimeline.tsx` into a 4-column editorial tactile card grid (`bg-[#FAF8F3]/90 border border-[#14170F]/12 rounded-2xl p-6 shadow-sm card-3d-tactile`) featuring `Fraunces` step numbers `01`–`04`, Lucide icon badges, bold `#14170F` titles, readable descriptions, and direct action links (`Explore Guide →`, `View Map →`, `Book Slot →`, `View Metrics →`).
     - Adds `pt-24 md:pt-0` mobile top spacing and hides desktop scroll indicators on mobile to prevent navbar and badge overlaps at 375px.
3. **Important files:** `client/src/components/ui/wave-background.tsx` (Canvas 2D silk-circuit engine), `client/src/components/ScrollCanvasAnimation.tsx` (elliptical radial mask & studio ambient glow), `client/src/App.tsx` (light paper global background), `client/src/pages/Landing.tsx` (contrast architecture & mobile layout), `client/src/components/HowItWorksTimeline.tsx` (4-column editorial card grid).
4. **How it was tested:** Built client production bundle with `npm --prefix client run build` confirming 0 TypeScript errors; verified with Playwright across `/`, `/guide`, and `/centers` at 1440px desktop and 375px mobile; inspected scroll positions at 0%, 25%, Stats, Action Cards, How It Works grid, Impact, and CTA; verified zero console errors; and saved full-resolution screenshots in `docs/screenshots/silk_waves_*.png`.
5. **Remaining limitations:** Wave canvas rendering pauses off-screen computation when component unmounts; mobile devices receive responsive touch-drag wave interaction instead of hover spotlighting.

---

## Stage N: Full-Stack Vercel Serverless Architecture & State Synchronization

1. **What it does:** Prepares EcoCircuit for seamless zero-config full-stack deployment on Vercel, allowing the React frontend and all `/api/*` backend routes (`/api/health`, `/api/centers`, `/api/pickups`, `/api/pickups/all`, `POST /api/pickups`, `PATCH /api/pickups/:id`) to run harmoniously under a single clean domain without CORS friction, while preserving local development workflows.
2. **How it works:**
   - **Production Serverless API (`api/index.ts`):** Implements a lightweight, self-contained Vercel Serverless Function at the repo root. Eliminates binary dependencies (such as `mongodb-memory-server`) that cannot run in serverless container environments, embedding verified LPU campus collection centers, sample campus pickup requests, and GEM 2024 environmental impact calculations.
   - **Zero-Latency Client Persistence (`client/src/utils/pickupStorage.ts`):** Synchronizes new pickup submissions and status transitions into browser `localStorage` (`ecocircuit_custom_pickups` and `ecocircuit_status_overrides`), merging seamlessly with API responses across serverless cold starts and user navigation.
   - **Unified Deployment Routing (`vercel.json`):** Configures single-domain rewrites routing `/api/*` requests to the serverless function and all other routes to `client/dist/index.html` for client-side SPA routing.
   - **Client API Relative Endpoints:** Audited and verified all `fetch` calls across `Centers.tsx`, `Pickup.tsx`, `Dashboard.tsx`, and `Admin.tsx` use relative `/api/...` paths.
3. **Important files:** `api/index.ts` (Vercel serverless API function), `client/src/utils/pickupStorage.ts` (client persistence engine), `vercel.json` (Vercel build and rewrite configuration), `client/src/pages/Pickup.tsx`, `client/src/pages/Dashboard.tsx`, `client/src/pages/Admin.tsx`.
4. **How it was tested:** Built both `client` (`npm --prefix client run build`) and `server` (`npm --prefix server run build`) with 0 errors; verified API routing and TypeScript types; verified local persistence fallback; staged and committed all files for remote GitHub deployment.
5. **Remaining limitations:** For a permanent production database, the in-memory serverless store can be connected directly to MongoDB Atlas via a `MONGODB_URI` environment variable.












