# [App Name] — AI Spend Audit Tool

A free web app that audits AI tool subscriptions for startup founders and engineering managers, surfacing overspend and recommending cheaper alternatives. Built as a lead generation tool for Credex, which sells discounted AI infrastructure credits. No login required — get your audit in under 2 minutes.

## Live Demo
[Your Vercel URL here]

## Screenshots
[Add 3+ screenshots or a 30-second Loom link here]

## Quick Start

```bash
git clone [your repo URL]
cd credex-ai-audit
npm install
cp .env.example .env.local
# Fill in your environment variables in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deploy to Vercel

1. Push repo to GitHub
2. Import to Vercel at vercel.com/new
3. Add all environment variables in the Vercel dashboard
4. Deploy — done

## Running Tests

```bash
npm run test
```

## Decisions

1. **Next.js 14 App Router over Pages Router** — App Router allows per-route metadata for Open Graph tags on the shareable audit URL, a hard requirement. Pages Router would have required a custom _document.tsx workaround and could not do server-side metadata per dynamic route as cleanly.

2. **Groq over Anthropic API for AI summary** — Groq offers a completely free tier with no credit card required, uses Llama 3 which is more than capable for a 100-word summary, and the API format is nearly identical to OpenAI so integration was fast. The assignment permitted any LLM.

3. **Hardcoded rules for audit engine instead of AI** — The audit math must be defensible to a finance person with exact numbers. AI introduces hallucination risk on the one part of the product where precision is non-negotiable. Deterministic TypeScript functions are auditable, testable, and consistent. This was an intentional architectural decision.

4. **Honeypot field over hCaptcha for abuse protection** — hCaptcha adds friction to legitimate users and requires a third-party script that hurts Lighthouse performance scores. A honeypot hidden field stops the majority of bot submissions with zero UX impact and no external dependency.

5. **Supabase over Firebase** — Supabase gives a proper PostgreSQL schema with row-level security, making it straightforward to separate public audit data from private lead data. The SQL interface also made writing the audits and leads tables intuitive, and the free tier is generous enough for this scale.
