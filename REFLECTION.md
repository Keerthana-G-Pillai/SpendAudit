# Reflection

### 1. The hardest bug you hit this week, and how you debugged it
The hardest bug I encountered was a Next.js `Unhandled Runtime Error` that completely crashed the production Vercel build, even though the application worked perfectly in local development. The crash originated from the `VisualBuilder` component. My initial hypothesis was that `react-hook-form` was causing hydration mismatches because the form state wasn't rendering identically on the server and client. I tried aggressively wrapping the form outputs in `useEffect` boundaries to delay rendering until hydration, but the crash persisted on deployment.

After examining the minified Vercel production logs, I noticed the stack trace pointed directly to event handler initialization inside the hero section and form wrappers. My second hypothesis was that I had unintentionally passed a function to a Server Component. Next.js 14 strictly enforces that Server Components cannot serialize event handlers (like `onClick` or custom interaction hooks). I had nested a complex interactive dropdown inside a parent layout that was lacking the `"use client"` directive. Because the local dev server is more forgiving with client boundaries to enable fast refresh, the error was masked until the strict production compilation process tried to statically generate the page.

To fix it, I explicitly isolated the interactive UI into a dedicated client-side component (`VisualBuilder.tsx`) with a strict `"use client"` boundary, and moved the static surrounding layout into a pure Server Component. This immediately resolved the Vercel crash and actually improved the initial page load time by reducing the overall JavaScript bundle size.

### 2. A decision you reversed mid-week, and what made you reverse it
Mid-week, I reversed the decision to use modern CSS OKLCH color variables for the Shadcn/UI configuration. When I first initialized the project, I opted into the v4 Shadcn defaults which heavily rely on OKLCH and newer CSS features designed for Tailwind v4. However, the project was bound to Tailwind v3 due to Next.js 14 template constraints.

This created immediate compatibility issues where standard utility classes (like `bg-primary` or `text-muted-foreground`) were failing to resolve the OKLCH values properly across older browser engines and specific Tailwind compilation steps, leading to missing backgrounds and invisible text. I initially tried to force OKLCH support by hacking the Tailwind config with custom plugins and fallback variables. However, this made the CSS incredibly brittle and hard to debug. I realized I was fighting the framework rather than building the product. I reversed course, stripped out the OKLCH configuration, and downgraded the variables to standard HSL values (Shadcn v0/v1 style). This stabilized the UI immediately, ensured full compatibility with the existing Tailwind v3 ecosystem, and saved hours of unnecessary CSS debugging.

### 3. What you would build in week 2 if you had it
If I had a second week, I would focus entirely on the post-audit retention loop and multiplayer features. Right now, the tool operates as a single-player, single-session experience. An engineering manager runs the audit, views the results, and hopefully shares it. 

I would build a "Team Workspace" feature where users can save their audit by creating a lightweight account. Within this workspace, they could invite their CTO or Finance Lead to view the audit collaboratively. Instead of a static snapshot, the workspace would connect directly to their actual vendor APIs (via OAuth integrations with GitHub Copilot or Anthropic) to ingest real-time usage metrics. This transforms the product from a one-off calculator into a persistent FinOps dashboard.

Additionally, I would implement an automated alert system. By saving their stack profile, Credex could proactively email the user whenever a vendor changes their pricing model or whenever Credex secures a new batch of discounted institutional credits that apply to their specific tools. This creates an ongoing, high-value relationship that drastically lowers the long-term Customer Acquisition Cost.

### 4. How you used AI tools
I used AI tools (primarily Claude and Cursor) as an aggressive pair-programmer and boilerplate generator. For tasks like initializing the Next.js scaffolding, drafting the Zod schema validation for the `SpendForm`, and generating the layout structures for the `VisualBuilder`, AI dramatically accelerated my velocity. It essentially removed the friction of typing out standard React boilerplate.

However, I explicitly did not trust the AI with the core business logic or the pricing data. AI models frequently hallucinate pricing tiers or mix up obsolete plans (like hallucinating a "ChatGPT Pro" plan instead of "ChatGPT Plus"). I manually researched every vendor pricing page and strictly hand-coded the `PRICING` constants and threshold rules inside `audit.ts`.

One specific time the AI was wrong and I caught it: I asked Cursor to refactor the frontend directory structure to resolve a module import issue with `nanoid`. The AI confidently suggested modifying the `tsconfig.json` paths array. I applied the change, but the build still failed. The AI failed to account for how Next.js explicitly resolves external modules via Webpack during the production build step. I had to manually discard the AI's suggestion and properly update `config.resolve.modules` in `next.config.mjs` to fix the compilation error. 

### 5. Self-rating on a 1–10 scale
Discipline: 7/10 — Maintained daily commits but a few devlog 
entries were written retrospectively rather than in real time.

Code quality: 7/10 — The audit engine is clean and well tested 
but some React components grew too large and should be split.

Design sense: 8/10 — Deliberately avoided generic templates 
but mobile responsiveness needed more attention than I gave it.

Problem-solving: 8/10 — Navigated real Next.js and CI issues 
by forming hypotheses but leaned on AI more than I should have 
for debugging.

Entrepreneurial thinking: 8/10 — Grounded the product in a 
real business model with defensible unit economics but only 
managed 3 user interviews when more would have sharpened 
the GTM strategy.
