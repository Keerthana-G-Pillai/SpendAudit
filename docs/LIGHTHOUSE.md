# Lighthouse targets

Targets: **Performance ≥ 85**, **Accessibility ≥ 90**.

## Changes made for scores

### Performance
- No third-party scripts (no CAPTCHA, no analytics on critical path)
- Tailwind only — no heavy font CDN
- Minimal client JS on landing (form + results pages only)
- `next/image` not required — no hero images

### Accessibility
- All inputs have visible or `sr-only` labels with `htmlFor` / `id`
- `role="alert"` on form errors; `aria-busy` on submit buttons
- Minimum **44px** touch targets on buttons and inputs
- Semantic headings (`h1`, `h2`), `fieldset`/`legend` on tool list
- Decorative symbols marked `aria-hidden`
- Focus rings on interactive elements
- Honeypot uses `sr-only` (not `aria-hidden` on focusable — removed from tab order via `tabIndex={-1}` on honeypot only)

## How to audit locally

1. `npm run build && npm run start` in `frontend/`
2. Chrome DevTools → Lighthouse → Mobile
3. Test `/` (landing) and a sample `/audit/[slug]` page

Expected on production build: Performance 85–95, Accessibility 90–100 for these routes.
