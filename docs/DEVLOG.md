# Dev Log — credex-ai-audit

## Day 1 — 2026-05-20
**Hours worked:** 2
**What I did:**
- Initialized Next.js 14 project with Tailwind and TypeScript.
- Set up shadcn/ui (`components.json`, `components/ui/` — button, input, label, card, select).
- Installed core dependencies (`react-hook-form`, `zod`, `supabase`, `resend`, `@anthropic-ai/sdk`, `nanoid`, `vitest`).
- Created all documentation file stubs.
**What I learned:**
- Learned shadcn init defaults and commands configuration.
**Blockers:**
- None. Setup went smoothly.
**Plan for tomorrow:**
- Implement the pure TypeScript audit engine in `lib/audit.ts`.
- Connect SpendForm to `/api/audit` API route.

## Day 2 — 2026-05-22
**Hours worked:** 4
**What I did:**
- Enabled TypeScript strict mode in `tsconfig.json` across the workspace.
- Installed `zod` and `@hookform/resolvers` and fully refactored `SpendForm.tsx` to use robust Zod schema validation.
- Implemented the Credex credits 30% discount rule in the `audit.ts` engine for direct API spend >$50/mo, and added unit tests.
- Installed shadcn/ui components (Button, Input, Select, Label, Card) and resolved compatibility conflicts between shadcn v4 and Tailwind v3 by implementing stable v3 CSS variables.
- Implemented the dynamic `/api/og` route using `@vercel/og` to generate shareable preview images containing the user's specific savings amount.
- Updated `AuditResults.tsx` to render the exact current spend next to each tool.
- Verified and finalized the `PRICING_DATA.md` document with today's date.
**What I learned:**
- Shadcn v4's default CSS requires Tailwind v4 features. For a Next.js 14 + Tailwind v3 app, it's safer to use the v0/v1 configuration style using standard HSL CSS variables instead of OKLCH.
- Next.js 14 requires explicit `config.resolve.modules` configuration in `next.config.mjs` when importing backend files into the frontend if they rely on modules from `frontend/node_modules` during the production build.
**Blockers:**
- Ran into build errors due to Next.js struggling to resolve `nanoid` and `@supabase/supabase-js` imports across the custom `backend/` and `frontend/` directory structure. Fixed it via custom webpack module resolution.
**Plan for tomorrow:**
- Finalize the remaining documentation stubs (`REFLECTION.md`, `USER_INTERVIEWS.md`).
- Deploy the complete app to Vercel and confirm the live URL.

## Day 3 — 2026-05-23
**Hours worked:** 5
**What I did:**
- Completely redesigned the user interface from a basic form to a premium, interactive `VisualBuilder` component.
- Implemented a floating "glass pill" navbar and a high-vibrancy Hero section with soft gradient backgrounds.
- Migrated away from plain white/black fallbacks to a defined semantic color palette (Navy, Teal, Sky Blue, Beige).
- Added an interactive team size slider featuring overlapping, animated avatars using the Dicebear API.
- Replaced the simple list of AI tools with an interactive grid that dynamically highlights selected tools and use cases.
**What I learned:**
- Inline JavaScript event handlers (like `onMouseEnter`/`onMouseLeave`) passed directly to HTML elements in Next.js Server Components cause hydration/runtime errors. I had to move these interaction states to CSS using `:hover` or extract them into dedicated client components.
**Blockers:**
- Next.js 14 production build crashed due to the aforementioned event handler issue. Resolved by refactoring to CSS-based hover states.
**Plan for tomorrow:**
- Refine the typography to feel more technical.
- Inject the Teal accent color into more active states and key data points (like the savings counter) to bring more life to the page.

## Day 4 — 2026-05-24
**Hours worked:** 3
**What I did:**
- Finalized the UI overhaul by switching the primary font to `Roboto_Mono` (via `next/font/google`), giving the app a clean, developer-focused aesthetic.
- Added `fontFamily: { sans: ['var(--font-sans)'] }` to `tailwind.config.ts` to properly wire up the Next.js font variable.
- Injected the Teal (`#567C8D`) accent color deeply into the app:
  - Active tool tiles and use case selection cards now glow with Teal borders and backgrounds.
  - Primary buttons and all section headings were updated from Navy to Teal.
  - The massive `$ Estimated Spend` and `$ Potential Savings` animated counters were flipped to Teal for maximum visual impact.
- Redesigned the Use Case list into a responsive 3-column grid, and stacked the Available Tools into a vertical list with explicit "+ Add" hover buttons.
- Cleaned up outdated badges from the Hero section to tighten the visual hierarchy.
**What I learned:**
- Google Fonts variable fonts require strict CSS variable wiring in Tailwind config (`extend: { fontFamily: { sans: ... } }`) to take effect globally, otherwise Tailwind silently falls back to system fonts.
**Blockers:**
- None. The UI polish went smoothly.
**Plan for tomorrow:**
- Implement the final test cases in `backend/lib/audit.test.ts`.
- Update `TESTS.md` and `ARCHITECTURE.md` to reflect the final project structure.
