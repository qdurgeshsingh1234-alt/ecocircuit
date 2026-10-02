# EcoCircuit — E-Waste Collection & Management Platform

A portfolio-grade web application built for CHE110 Environmental Studies. EcoCircuit helps communities and individuals locate certified e-waste drop-off points, schedule doorstep collections, understand hazardous materials in discarded electronics, and track personal environmental impact metrics.

---

## Tech Stack

### Frontend
- **Framework**: Vite 8 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Typography**: Fraunces (headings) & Space Grotesk (body/UI) via `@fontsource`
- **Animations**: Framer Motion (components) + GSAP ScrollTrigger (hero parallax)
- **Routing**: React Router v7
- **Maps**: Leaflet + React-Leaflet (Phase 3)
- **Charts**: Recharts (Phase 5)

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose (In-memory via `mongodb-memory-server` for zero-configuration local runs; point `MONGO_URI` to a cluster for production)
- **Validation**: Zod
- **Architecture**: REST API

---

## Design System: "Circuit Meets Soil"

- `--ink`: `#14170F` (warm near-black text and dark sections)
- `--paper`: `#F4F1E9` (warm off-white main background)
- `--moss`: `#2F4E3A` (deep forest green primary brand color)
- `--copper`: `#B5652D` (burnt copper/amber accent for CTAs)
- `--sand`: `#E4DCC6` (muted warm neutral for cards & dividers)
- `--signal`: `#6B8F71` (soft sage secondary accent & success states)
- `--rust`: `#9B4A3E` (desaturated rust red for hazard warnings)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2. Run both Client & Server concurrently
```bash
npm run dev
```

- **Client**: `http://localhost:5173`
- **API**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/api/health`