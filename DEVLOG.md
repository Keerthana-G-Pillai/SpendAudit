
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
- Set up Continuous Integration (CI) workflows
- Upgrade ui ux


## Day 3 — 2026-05-23
**Hours worked:** 5
**What I did:**
- Integrated an interactive hexagon background, flickering grid, and morphing headlines into the frontend design.
- Added premium UI components and optimized the tool-specific `SpendForm` dropdowns for a better user experience.
- Set up Continuous Integration (CI) workflows, fixing several pathing issues by pointing the CI workflow directly to the frontend directory.
- Resolved CI sync errors by adding `package-lock.json` and using `npm install` instead of `npm ci` for the build steps.
**What I learned:**
- When dealing with monorepos or nested frontend directories, CI tools can fail if `package-lock.json` is missing or if the working directory isn't explicitly defined. `npm install` gracefully handled the lock file sync better than `npm ci` in this specific setup.
**Blockers:**
- Struggled briefly with GitHub Actions failing on lockfile verification, but resolved it by syncing the lockfile and adjusting the install command.
**Plan for tomorrow:**
- Overhaul the user interface to replace the basic form with an interactive visual builder.
- Deploy the complete app to Vercel and confirm the live URL.

## Day 4 — 2026-05-24
**Hours worked:** 4
**What I did:**
- Overhauled the user interface into a cohesive visual builder featuring refined typography and a semantic Teal color scheme.
- Deployed the final application to Vercel and confronted a critical build failure in the production environment.
- Encountered and traced a Next.js `Unhandled Runtime Error` .
- Resolved the Vercel build crash by removing the inline JavaScript handlers 
**What I learned:**
- Server Components in Next.js 14 are strictly static during rendering and will crash the production build if you attempt to pass functions to them without explicitly defining a `"use client"` boundary. Moving interaction logic to CSS is often a safer and more performant fallback.
**Blockers:**
- The Vercel deployment was initially blocked by the event handler runtime error, requiring a pivot in how hover states were handled.
**Plan for tomorrow:**
- Implement the final test cases in `backend/lib/audit.test.ts`.
- Update `TESTS.md` and `ARCHITECTURE.md` to reflect the final project structure.

## Day 5 — 2026-05-25
**Hours worked:** 4
**What I did:**
- Redesigned the Team Size slider (Step 1) in `VisualBuilder.tsx` to a horizontal header row showing label, real-time overlapping avatars count (`Math.min(Math.floor(teamSize / 10) + 1, 8)`), a `>` indicator when `teamSize > 70`, and a numeric capacity badge on the right.
- Styled the range slider track with dynamic Teal-to-Navy gradient fills based on the handle position, and set up a custom circular white thumb with a Navy border.
- Integrated the Homepage floating glassmorphism navbar on the Audit Results page.
- Created a new dedicated `/faq` route under `app/faq/page.tsx` rendering the `SocialProof` and `LandingFAQ` components under a consistent floating navbar.
- Simplified the footers in both `app/page.tsx` (Homepage) and `components/AuditResults.tsx` to only show the copyright and email disclaimer bar, removing the nested FAQ and Social Proof components.
- Updated Navbar links across the application to route correctly to `/faq` and back to `/`.
- Updated Cursor, ChatGPT, and Windsurf pricing plans and rates inside `VisualBuilder.tsx`, `audit.ts`, `SpendForm.tsx`, and `PRICING_DATA.md`.
- Updated all unit tests in `audit.test.ts` to sync with the new plan names and pricing rates.
**What I learned:**
- Segmenting secondary elements like FAQs and Social Proof to separate static pages significantly lightens the initial load size of main landing and dynamic results pages, improving speed and readability.
- Reusing common layouts like the floating navbar across page routes makes the web app feel polished and integrated.
**Blockers:**
- None. Updates were applied cleanly and validated successfully via the local build and vitest runners.

## Day 6 — 2026-05-26
**Hours worked:** 5
**What I did:**
- Flattened the project directory structure, merging `frontend/` and `backend/` into a single root Next.js 14 App Router project to simplify imports and CI configuration.
- Cleaned the Git index by removing obsolete `.next` build caches that were polluting the repository size and triggering GitHub LFS warnings.
- Validated fallback logic in `app/api/audit/route.ts` to ensure users always receive a response even if the LLM generation fails.
**What I learned:**
- Vercel's root directory configurations can easily break if the repository structure changes post-deployment. Flattening the architecture to the standard Next.js root layout eliminated deployment friction.
**Blockers:**
- The repository hit GitHub's file size limit due to compiled Webpack chunks accidentally being tracked, which temporarily blocked pushing. Fixed by updating `.gitignore` and purging the git cache.

## Day 7 — 2026-05-27
**Hours worked:** 3
**What I did:**
- Replaced real names with anonymized placeholders in user interview documentation to protect user privacy.
- Updated the FAQ copy directly from interview insights, ensuring the messaging explicitly addresses trust concerns without technical jargon.
- Stripped the `README.md` down to strictly the 5 required sections mandated by the assignment constraints.
- Analyzed production Lighthouse scores, achieving a perfect 100/100/100/100 across both Desktop and Mobile environments.
- Verified all grading rubric criteria (form state persistence, exact pricing calculations, specific CTA triggering based on savings tier).
**What I learned:**
- Third-party tracking scripts like Vercel Analytics inevitably cause a slight Total Blocking Time hit on throttled mobile devices. For a strict 100/100 grading requirement, removing them is the safest approach.
**Blockers:**
- None. The project is fully compliant and ready for final submission.
