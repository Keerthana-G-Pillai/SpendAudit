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
