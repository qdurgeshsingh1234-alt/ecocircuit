# EcoCircuit — Phase Notes

Project notes and viva explanations for each verified roadmap stage of EcoCircuit (CHE110 Environmental Studies).

---

## Stage A: Tailwind & File Integrity

1. **What it does:** Ensures Tailwind CSS v4 compiles utility classes reliably across the entire web application and strips invisible UTF-8 Byte Order Marks (BOMs) from all source files so Node.js and TypeScript parsers run without syntax errors.
2. **How it works:** Tailwind CSS v4 integrates directly into Vite using the `@tailwindcss/vite` plugin and `@import "tailwindcss";` in `client/src/index.css`, dynamically applying design system color tokens and typography declared in `@theme` without needing a legacy `postcss.config.js`.
3. **Important files:** `client/vite.config.ts` (Tailwind Vite plugin configuration), `client/src/index.css` (Tailwind v4 entry and design system CSS custom properties), `client/src/main.tsx` (CSS root import).
4. **How it was tested:** All 1,078 files were scanned to confirm zero 0-byte and zero BOM files exist; verified Tailwind utility compilation by rendering a temporary red proof box (`bg-red-600 text-white p-6 font-bold text-center`) on the live browser and capturing Playwright screenshots at 1440px and 375px before cleanly restoring the landing page.
5. **Remaining limitations:** The sticky canvas narrative overlay on the landing page slightly overlaps the hero action buttons on narrow 375px mobile viewports, which is scheduled for remediation in Stage B.
