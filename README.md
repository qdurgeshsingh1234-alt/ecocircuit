# EcoCircuit — E-Waste Collection & Management Platform

A web application designed for **CHE110 Environmental Studies** (Continuous Assessment 1, Topic 12: *E-Waste Collection and Management Platform*) at **Lovely Professional University (LPU), Phagwara, Punjab**.

EcoCircuit provides a unified digital workflow for campus students, faculty, and hostel residents to verify item recyclability, locate nearby drop-off bins, schedule room/department pickups, and visualize personal diversion metrics.

---

## 1. Problem Statement & Pilot Region

### The Problem
Dead smartphones, bloated power banks, tangled chargers, obsolete laptops, and worn-out lab appliances accumulate in hostel rooms and department cupboards. Because students and staff often lack awareness regarding toxic constituent materials (lead, mercury, cadmium, brominated flame retardants) or convenient drop-off options, hazardous electronics are frequently tossed into ordinary municipal bins or hoarded indefinitely.

### Pilot Region
- **Primary Campus**: Lovely Professional University (LPU), Phagwara, Punjab — 144411 (Campus Center coordinates: `31.255° N, 75.705° E`).
- **Campus Locations**: Boys Hostel Blocks (BH-1 to BH-8), Girls Hostel Blocks (GH-1 to GH-6), Academic Blocks (32, 34, 36, 38, 55), Central Library, Uni-Mall, and residential quarters.
- **Regional Cluster**: Authorized e-waste recyclers and processing facilities situated in the Phagwara Industrial Area and the Jalandhar GT Road corridor.

---

## 2. Platform Architecture & Route Breakdown

The platform consists of 6 dedicated routes serving distinct steps of the campus e-waste lifecycle:

```
/           Landing Page (Hero canvas teardown, problem narrative, live metrics)
/guide      Campus Disposal & Verification Guide (Search catalog, checklist, battery safety)
/centers    Drop-off Locations & Interactive Map (Leaflet map, distance sorting, directions)
/pickup     Hostel & Department Collection Request (5-step wizard, ECO-XXXXXX tracking)
/dashboard  User Impact Dashboard (Session persistence, Recharts visualization)
/admin      Demo-Only Administration Portal (Unauthenticated collector queue, status transitions)
```

### Route 1: Landing Page (`/`)
- **Scroll-Scrubbed Teardown Sequence**: Features a 198-frame canvas animation illustrating a device teardown sequence synced to scroll distance, communicating the recoverable minerals (gold, copper, lithium) and toxic hazards locked inside discarded electronics.
- **Preload & Accessibility**: Includes real-time image asset loading progress and respects `prefers-reduced-motion: reduce` by providing clean static representations for users with motion sensitivities.
- **Campus User Journey**: Highlights the 4 key steps: Check Item → Find Center → Request Collection → Track Impact.
- **Dynamic Counters**: Live counters summarizing campus e-waste diversion metrics and hostel participation.

### Route 2: Campus Disposal & Verification Guide (`/guide`)
- **Instant Search Catalog**: Real-time filtering across 36 common campus devices and accessories by name and keyword aliases.
- **Regulatory Verdicts**: Instant categorization into *Verified E-waste*, *Hazardous / Special Handling*, *Non-electronic Refuse*, and *Repair / Reuse Recommended*.
- **Pre-Disposal Checklist**: Interactive 7-point data sanitization and safety checklist (cloud backup, account unpairing, factory reset, SIM/microSD ejection, terminal insulation).
- **Battery Safety Protocols**: Dedicated hazard protocol callout addressing swollen or punctured lithium-ion cells with immediate quarantine guidelines.
- **Deep Links**: Contextual navigation linking directly to filtered drop-off points (`/centers?category=...`) and collection scheduling (`/pickup?category=...`).

### Route 3: Collection Centers & Interactive Campus Map (`/centers`)
- **OpenStreetMap Integration**: Powered by Leaflet with brand-styled SVG `DivIcon` markers (avoiding Vite asset loading defects).
- **Distance Calculation**: Dynamic client-side Haversine distance computation sorted ascending from the LPU campus center (`31.255° N, 75.705° E`).
- **Bidirectional Synchronization**: Clicking a list card pans and opens the map marker popup; clicking a map marker scrolls and highlights the corresponding list card.
- **Category & Type Filters**: Filter drop-off points by accepted e-waste categories (synchronized with URL query params: `?category=...`) and location types (*Campus Drop-off*, *Collection Drive*, *Authorized Recycler*).
- **Google Maps Navigation**: External one-click routing URLs for walking and driving navigation to each verified location.

### Route 4: Hostel Collection Request Wizard (`/pickup`)
- **5-Step Form Wizard**: Guides users through Category Selection, Approximate Quantity/Volume, Campus Location & Preferred Window, Contact Details, and Final Review.
- **Campus Presets**: Tailored dropdown of LPU hostel blocks (BH-1 to BH-8, GH-1 to GH-6) and academic departments—no external street addresses required.
- **Validation**: Enforces 10-digit Indian mobile numbers (`/^\d{10}$/`) and valid institutional email formats.
- **Tracking Reference Generator**: Generates canonical `ECO-XXXXXX` tracking IDs (6 alphanumeric characters) for all scheduled requests.
- **Confirmation View**: Displays scheduled collection details, one-click clipboard copy for tracking ID, state reset for additional requests, and direct links to `/dashboard?email=...`.

### Route 5: Personal Impact Dashboard (`/dashboard`)
- **Account Lookup**: Instant lookup by email without requiring complex passwords, designed for rapid evaluation and student accessibility.
- **Session Persistence**: Persists active email in `sessionStorage` and synchronizes with URL parameters (`?email=...`) so metrics survive browser refreshes.
- **Visual Analytics**: Interactive Recharts bar graph displaying kilograms diverted per request, styled in strict brand tokens (`#2F4E3A`, `#B5652D`, `#6B8F71`, `#9B4A3E`).
- **Aggregated Metrics**: Computes total weight diverted (kg) and greenhouse gas emissions avoided (kg CO₂e) based on United Nations Global E-waste Monitor (GEM 2024) conversion factors.
- **Sample Presets**: Quick-fill buttons for test evaluation accounts (`sample.student1@lpu.in`, `sample.faculty@lpu.in`).

### Route 6: Demo Administration Portal (`/admin`)
- **Demo-Only Interface**: Operates without authentication barriers for evaluation convenience, prominently displaying a "Demo-Only Administration Interface" banner.
- **Collector Queue**: Interactive tabular view of all campus pickup requests showing tracking ID, timestamp, hostel location, accepted categories, and contact details.
- **Status Lifecycle Transitions**: Enables campus collectors to transition request states in real-time (`Requested → Scheduled → Collected`) via optimistic UI updates backed by `PATCH /api/pickups/:id`.
- **Search & Filter Tabs**: Instant filtering by status chips (*All*, *Requested*, *Scheduled*, *Collected*) and search across student names, hostel rooms, and tracking IDs.
- **Responsive Layout**: Full data table on desktop (1440px) transitioning to structured card stacks on mobile viewports (375px).

---

## 3. Design System: "Circuit Meets Soil"

The platform adheres strictly to the "circuit meets soil" aesthetic, blending organic ecological earth tones with precise electronic copper pathways:

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Ink** | `#14170F` | Warm near-black text, dark editorial surfaces, high-contrast badges |
| **Paper** | `#F4F1E9` | Warm tactile off-white background surface |
| **Moss** | `#2F4E3A` | Primary ecological brand green, verified badges, action buttons |
| **Copper** | `#B5652D` | Burnt copper accent for secondary buttons, highlights, tracking IDs |
| **Sand** | `#E4DCC6` | Neutral border lines, card backdrops, subtle dividers |
| **Signal** | `#6B8F71` | Sage green accent for positive statuses and category tags |
| **Muted Rust** | `#9B4A3E` | Desaturated warning red for battery hazard callouts and errors |

- **Typography**: Headings set in **Fraunces** (serif) for human warmth and editorial dignity; body and user interfaces set in **Space Grotesk** for technical legibility.
- **Geometry & Cards**: Subtle 1px borders (`border-sand`), border radiuses between `8px` and `12px`, generous padding, and zero distracting gimmicks (no off-brand neon glows, no purple/blue gradients, no 3D mouse tilts).
- **Icons**: Exclusively Lucide React vector icons; zero emoji icons in core UI components.

---

## 4. Tech Stack & Dependencies

### Client
- **Runtime & Build**: Vite 8, React 19, TypeScript
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Typography**: `@fontsource/fraunces`, `@fontsource/space-grotesk`
- **Animation**: Framer Motion (page and component transitions)
- **Data Visualization**: Recharts (impact history bar chart)
- **Mapping**: Leaflet, React-Leaflet (custom DivIcon SVGs)
- **Icons**: Lucide React

### Server
- **Runtime**: Node.js, Express, TypeScript
- **Data Persistence**: Mongoose with `mongodb-memory-server` (starts automatically in-memory for zero-friction local execution without requiring a local MongoDB daemon)
- **Validation**: Zod schema validation
- **Identifiers**: Nanoid (alphanumeric uppercase tracking codes)

---

## 5. Setup & Local Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Windows PowerShell, macOS Terminal, or Linux Bash

### 1. Installation
Clone the repository and install root and package dependencies:

```powershell
# In the ecocircuit repository root:
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Development Mode
Run both the Vite client (`http://localhost:5173`) and Express server (`http://localhost:4000`) concurrently:

```powershell
npm run dev
```

- **Client App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Health Endpoint**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

### 3. Production Build
Verify TypeScript compilation and bundle production assets:

```powershell
npm --prefix client run build
npm --prefix server run build
```

---

## 6. Environmental Impact Calculation & Assumptions

Environmental metrics displayed across `/pickup`, `/dashboard`, and `/admin` are computed using benchmark values from the **United Nations Global E-waste Monitor (GEM 2024)**:

- **Baseline Unit Weights**:
  - `it-equipment`: ~4.5 kg (laptops ~2.2 kg, desktop monitors ~4.5 kg)
  - `large-appliances`: ~30.0 kg (mini-coolers, microwaves, small refrigerators)
  - `small-appliances`: ~2.0 kg (electric kettles, irons, hairdryers)
  - `mobiles-accessories`: ~1.2 kg (smartphones ~0.18 kg + power banks/chargers)
  - `cables-peripherals`: ~1.0 kg (tangled cords, mice, keyboards)
  - `batteries`: ~0.5 kg (assorted lithium-ion and household dry cells)
  - `lighting`: ~0.3 kg (CFL lamps, LED fixtures)
- **Quantity Scale Multipliers**: `1–2 items` (1.5x), `3–5 items` (4.0x), `5+ items` (8.0x), `1–2 large items` (1.5x), `A bag or box` (5.0x), `More than a box` (12.0x).
- **Carbon Offset Factor**: Every 1 kg of e-waste recycled avoids approximately **1.5 kg CO₂e** otherwise emitted during virgin mineral extraction and smelting.
- **Labeling Policy**: All calculated metrics are explicitly labeled in the user interface as `"Estimated impact (Sample data)"` to reflect prototype status.

---

## 7. Sample Data Policy & Prototype Limitations

- **Academic Demonstration**: All collection points, hostel pickup schedules, coordinates, and contact details are simulated sample records created for the CHE110 coursework evaluation at Lovely Professional University.
- **Authentication**: The `/admin` collector portal and `/dashboard` are deliberately unauthenticated to allow seamless grading and review without login credentials.
- **Future Enhancements**: Production deployment would integrate JSON Web Tokens (JWT) / OAuth 2.0 with LPU university email domains, role-based access control (RBAC), physical scale Bluetooth integration for verified weighing, and automated SMS notifications for arrival reminders.