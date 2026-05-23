# [App Name] — AI Spend Audit Tool

A free web app that audits AI tool subscriptions for startup founders and engineering managers, surfacing overspend and recommending cheaper alternatives. Built as a lead generation tool for Credex, which sells discounted AI infrastructure credits. No login required — get your audit in under 2 minutes.


## Live Demo
[Your Vercel URL here]

## Screenshots
[Add 3+ screenshots or a 30-second Loom link here]

## Quick Start

```bash
git clone [your repo URL]
cd credex_
npm install --prefix frontend
cp frontend/.env.example frontend/.env.local
# Fill in your environment variables in frontend/.env.local
npm run dev
```

Runs the Next.js app from the repo root (delegates to `frontend/`). Open the URL shown in the terminal (usually http://localhost:3000).

## Project Structure

```
credex_/
├── frontend/     # Next.js UI (pages, components, styles)
├── backend/      # API routes, audit engine, Supabase client
└── docs/         # Product and architecture documentation
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Abuse protection (lead capture)

Lead submissions use **two layers**:

1. **Honeypot field** (`website`) — hidden from users; bots often auto-fill it. If filled, the API returns `{ success: true }` without saving or emailing, so bots get no signal they were blocked.
2. **Rate limiting** — max **5 submissions per IP per hour** on `POST /api/lead`. Returns HTTP 429 when exceeded.

**Why honeypot over CAPTCHA:** hCaptcha adds friction and a third-party script that hurts Lighthouse scores. The honeypot stops most scripted spam with zero UX cost.

**Rate limit caveat:** the limiter is in-memory and resets on serverless cold starts. For production scale, move to [Upstash Redis](https://upstash.com/) (noted in `docs/ARCHITECTURE.md`).

## Features

| Requirement | Implementation |
|-------------|----------------|
| ~100-word AI summary | Groq (`llama-3.1-8b-instant`) in `backend/api/audit/route.ts`; prompt in `backend/lib/prompts.ts` and `docs/PROMPTS.md` |
| Email capture after results | `LeadCapture` only on `/audit/[slug]` via `AuditResults` — never on landing page |
| Supabase leads | `leads` table: email, company, role, team_size, audit_id |
| Resend confirmation | `POST /api/lead` after DB insert; if savings > $500/mo, email notes Credex will reach out |

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

4. **Honeypot + rate limiting for abuse protection** — see [Abuse protection (lead capture)](#abuse-protection-lead-capture) above.

5. **Supabase over Firebase** — Supabase gives a proper PostgreSQL schema with row-level security, making it straightforward to separate public audit data from private lead data. The SQL interface also made writing the audits and leads tables intuitive, and the free tier is generous enough for this scale.
