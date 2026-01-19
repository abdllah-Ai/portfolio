# SOP - Portfolio Rebuild Blueprint (Vite + React + Tailwind)
## Version: 2.1 - Grayscale Theme Overhaul + UX/Functionality Upgrade + Multi-Client Template (NO CODE, Prompt-Driven)

This SOP is designed to be sent to an assistant/dev who has repository access.
No code is included - instead, you'll find ready-to-copy prompts for each work package.
Copy one prompt at a time into the project chat and have the dev implement it.

---

## 0) Objective
- Rebuild / clean up the portfolio while preserving fixed assets and content.
- Replace all site colors with the grayscale palette (as in the reference image).
- Improve navigation, performance, modals, and admin UX so the site becomes a sellable template.
- Make it Multi-Client ready: new client = swap JSON + assets only (no component rewrites).

---

## 1) Fixed Assets (Do Not Change)
These items must remain unchanged across the rebuild:

1) Hero Lottie JSON
- Path: `src/assets/hero.json`

2) Projects list (content + order)
- Current source: `src/data/site.js -> site.projects[]`
- Must preserve: titles, blurbs, tags, highlights, tech, repo/demo links, and media (image/Lottie).

3) CV/PDF
- Path: `public/resume/Abdallah_Salah_CV.pdf`
- Used by "Download CV" buttons in Hero and Contact.

---

## 2) Tech Stack (Keep Compatible)
- React 19
- Vite 7
- Tailwind CSS v4 + PostCSS
- react-router-dom
- framer-motion
- lottie-react
- lucide-react
- react-helmet-async

Routes:
- `/` -> App -> PortfolioAI
- `/admin` -> Admin

---

## 3) Required Color Palette (Strict)
These are the only allowed base colors in the theme:

- Primary: `#222222`
- Secondary: `#7B7B7B`
- Tertiary: `#F8F8F8`
- White: `#FFFFFF`

### Mandatory Color Rules
- No hex colors inside `src/components/**` or JSX.
- No colored Tailwind utilities in components (e.g., `text-blue-*`, `bg-purple-*`, `from-indigo-*`, etc.).
- All UI colors must come from runtime CSS variables injected by the theme system.
- Dark mode must remain grayscale (no extra accent colors).

---

## 4) Required Deliverables
- Home (SPA) + Admin.
- A single, consistent theme system: buttons/cards/tags/modals/progress all based on CSS variables.
- Improved navigation: smooth scroll + active section highlight + reliable mobile menu.
- Modal upgrades: ESC close + outside click close + scroll lock + basic focus handling.
- Lottie reliability: consistent object/URL policy with safe fallbacks.
- Multi-Client mode: create new clients by swapping JSON + assets only.

---

## 5) Implementation Method: Prompt Work Packs
> Copy ONE prompt at a time and send it into the project chat.

---

# PROMPT PACK A - Audit + Remove Hardcoded Colors

### Prompt A1 - Full Color Audit
Copy/paste this prompt:

You are a senior frontend engineer. Perform a full audit for hardcoded colors in the repo.

Search for:
- Hex colors like `#...`
- Tailwind color utilities in components (e.g., `text-blue-*`, `bg-indigo-*`, `from-purple-*`, `ring-red-*`, etc.)
- Inline styles with fixed colors
- CSS files containing non-variable colors

Deliverables:
1) A list of files and exact locations/snippets where colors are hardcoded.
2) A replacement plan: map each hardcoded color usage to CSS variables or shared utility classes (card/button/chip).
3) A confirmation that after changes, there are no hardcoded colors inside components.

Constraints: do not alter fixed assets (Hero Lottie / Projects content+order / CV PDF).

---

### Prompt A2 - Remove/Neutralize Colored Glows/Orbs/Gradients
Copy/paste this prompt:

Review `src/index.css` and any components/CSS that implement "orbs", "neon", "glow", or colored gradients.

Goal: neutralize them to fit the grayscale palette:
- Light mode: calm neutral backgrounds (white/tertiary) with subtle grayscale depth only
- Dark mode: neutral dark surfaces with subtle grayscale overlays
- Any glow must be grayscale only with low opacity

Output: a clean, template-grade background system with no colored visual noise.

---

# PROMPT PACK B - Grayscale Theme System via Runtime CSS Variables

### Prompt B1 - Build a Single Theme Source of Truth (CSS Variables)
Copy/paste this prompt:

Implement/adjust the theme system so all UI colors come from runtime CSS variables injected by the theme.

Base palette (the only allowed colors):
- #222222 (primary)
- #7B7B7B (secondary)
- #F8F8F8 (tertiary)
- #FFFFFF (white)

Define standard variables used across the app:
- background, surface (cards), primary text, muted text, borders, shadows
- accent variables may only be derived from primary/secondary (no extra colors)

Apply for light/dark:
- Light: bg=white, surface=tertiary, text=primary, muted=secondary
- Dark: bg=primary, surface=white overlay, text=white, muted=white at lower opacity

Deliverables:
1) Theme tokens structure (palette + optional radius)
2) `applyTheme()` injects a `<style>` tag with CSS variables
3) Components contain no hardcoded colors (all read from variables/classes)

Important: do not place hex colors inside components.

---

### Prompt B2 - Standardize UI Utility Classes (No Color Values)
Copy/paste this prompt:

Update or create shared UI classes (in `src/index.css` or the project's global CSS layer) with no color literals, only CSS variables.

Required classes:
- `.card`
- `.btn-primary`
- `.btn-ghost`
- `.chip` / `.tag` / `.pill`
- `.modal-overlay`
- `.progress-track`

Then refactor all components to use these classes instead of Tailwind color utilities or inline colors.

---

# PROMPT PACK C - UX: Navigation + Sections + Motion

### Prompt C1 - Navbar Navigation Upgrade (Template-Grade)
Copy/paste this prompt:

Upgrade the Navbar to be template-grade:
- Smooth scroll to sections (no jump)
- Active section highlighting (simple underline/border) using CSS variables
- Fast, reliable mobile menu
- Keep theme toggle (system/light/dark) working
- Keep language toggle (en/ar) working

Do not use colored Tailwind utilities. Use variables/classes only.

---

### Prompt C2 - Section Transitions (Respect Reduced Motion)
Copy/paste this prompt:

Implement subtle section entrance animations using framer-motion (fade + small translate).

Must respect `prefers-reduced-motion`:
- If reduced motion is preferred, minimize or disable animations.

No new glows or colored effects.

---

# PROMPT PACK D - Modals (Projects/Gallery) + Accessibility Basics

### Prompt D1 - Professional Modal Behavior
Copy/paste this prompt:

Upgrade Projects and Gallery modals to professional behavior:
- Close on ESC
- Close on outside click
- Lock background scroll while open
- Basic focus management (focus a heading/button on open; restore focus on close if possible)

Use `.modal-overlay` and `.card` styling based on CSS variables.

---

# PROMPT PACK E - Lottie Reliability (One Policy, No Crashes)

### Prompt E1 - Unify Lottie Data Policy (Object vs URL)
Copy/paste this prompt:

Problem: Lottie sometimes receives a string path and sometimes a JSON object.

Define and enforce a single project-wide policy:
- Hero: remains fixed and uses `src/assets/hero.json` as-is.
- Projects/Gallery: choose ONE approach and apply consistently:
  (A) import JSON as objects in code, OR
  (B) fetch JSON from a public URL before render

Upgrade `LottieSafe` to support:
- JSON object input (render immediately)
- URL string input (if using B): fetch + show loading skeleton + error fallback

Deliverable: Lottie never crashes in Hero, Projects, or Gallery.

---

# PROMPT PACK F - Admin Upgrade (Sellable Template)

### Prompt F1 - Admin: Validation + Reset + Versioned Export
Copy/paste this prompt:

Upgrade the Admin experience for a sellable template:
- Add "Reset to Default" (restore the baseline content)
- Import must validate JSON shape and prevent breaking the site
- Export must be versioned (e.g., `{ version, clientId, content }`)
- Preview remains functional
- Theme editor should edit ONLY the grayscale palette (4 colors) + optional radius

No hex colors in components: all theme edits must update tokens -> variables.

---

# PROMPT PACK G - Multi-Client Template Mode (JSON + Assets Swapping)

### Prompt G1 - Move Content to Client JSON + Add Content Loader
Copy/paste this prompt:

Make the project Multi-Client:
- Move content currently in `src/data/site.js` and `src/data/skills.js` to JSON per client:
  - `content/clients/<clientId>/site.json`
  - `content/clients/<clientId>/skills.json`
  - `content/clients/<clientId>/theme.json` (palette only)
- Add a content loader that selects `clientId` from:
  - ENV `VITE_CLIENT_ID`, or optional query `?client=...`

Requirements:
1) A clear content schema and loader
2) ContentContext loads JSON and optionally merges with localStorage overrides
3) Client assets live under `public/clients/<clientId>/...` and JSON paths reference them consistently

Constraint: do not alter fixed assets listed in section 1.

---

### Prompt G2 - Make Gallery Data-Driven (No Hardcoded Array)
Copy/paste this prompt:

If Gallery content is hardcoded in code, move it into client JSON:
- Add `gallery` array inside `site.json`
- Gallery component reads from content only
- Support images and Lottie items using the unified Lottie policy

---

# PROMPT PACK H - Quality Pass (Performance + Consistency)

### Prompt H1 - Performance Pass
Copy/paste this prompt:

Run a lightweight performance pass without changing fixed content:
- Lazy-load images
- Reduce heavy visual effects
- Code-split `/admin` route (dynamic import)
- Remove unused legacy files
Deliver a short report of what changed and why.

---

### Prompt H2 - Consistency Pass (Spacing/Type/States)
Copy/paste this prompt:

Finalize UI consistency:
- All cards share the same radius/border/shadow system
- All buttons share consistent hover/active/disabled states
- Spacing and typography are consistent across all sections
- Muted text uses the theme muted variable everywhere

No new colors; variables only.

---

## 6) Final Acceptance Checklist (Must Pass)

### Fixed Assets
- [ ] Hero uses the exact `src/assets/hero.json`.
- [ ] "Download CV" points to `/resume/Abdallah_Salah_CV.pdf`.
- [ ] Projects list content and order are unchanged.

### Theme / Colors (Most Important)
- [ ] No hex colors inside `src/components/**`.
- [ ] No colored Tailwind utilities in components (text-blue/bg-purple/from-indigo/etc.).
- [ ] Only the required palette exists in the theme:
  - #222222 / #7B7B7B / #F8F8F8 / #FFFFFF
- [ ] Light/Dark modes work with strong contrast and consistent grayscale identity.
- [ ] Buttons/Cards/Tags/Modals/Progress rely on CSS variables.

### UX / Navigation
- [ ] Navbar smooth scroll works on all section links.
- [ ] Active section highlight is clear.
- [ ] Mobile menu behaves correctly.
- [ ] Animations respect prefers-reduced-motion.

### Functionality
- [ ] Lottie works in Hero + Projects + Gallery with no crashes.
- [ ] Modals: ESC close + outside click close + scroll lock + basic focus.
- [ ] Admin: Save/Import/Export/Reset + palette-only theme editing.
- [ ] Multi-Client: new client created by JSON + assets only, without changing components.

---

## 7) Handoff Requirements (What the Dev Must Deliver)
When done, provide:
1) A short change log (Markdown):
   - where hardcoded colors were removed
   - how theme variables are applied
   - what changed in Lottie/Modals/Admin/Multi-Client
2) Audit proof:
   - repo search showing no remaining hardcoded hex colors in components
3) A few screenshots for Light/Dark showing consistent grayscale styling

---

END OF SOP
