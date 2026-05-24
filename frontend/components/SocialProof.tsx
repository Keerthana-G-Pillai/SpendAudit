const TESTIMONIALS = [
  {
    quote:
      'We were paying for ChatGPT Team for 3 people. Plus would have done the same job for $30 less a month.',
    author: 'J.R., CTO',
    context: 'Seed-stage SaaS',
  },
  {
    quote:
      'I had no idea we were paying for overlapping tools. The audit paid for itself in the first month.',
    author: 'A.K., Engineering Manager',
    context: '15-person startup',
  },
  {
    quote:
      'Finally a tool that gives you a straight answer instead of trying to upsell you.',
    author: 'M.P., Solo founder',
    context: 'Bootstrapped',
  },
]

export default function SocialProof() {
  return (
    <section aria-labelledby="social-proof-heading">
      <h2 id="social-proof-heading" className="ui-label mb-4">
        What teams report
      </h2>
      <p className="text-[12px] text-zinc-400 mb-4">Illustrative quotes for launch</p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <li key={t.author} className="ui-section p-4 flex flex-col">
            <blockquote className="text-[13px] text-zinc-700 leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer className="mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              {t.author} · {t.context}
            </footer>
          </li>
        ))}
      </ul>
    </section>
  )
}
