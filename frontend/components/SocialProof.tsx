const TESTIMONIALS = [
  {
    quote:
      'We were paying for ChatGPT Team for 3 people. Plus would have done the same job for $30 less a month. Took 2 minutes to find out.',
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
    <section className="mt-12" aria-labelledby="social-proof-heading">
      <p id="social-proof-heading" className="sr-only">
        What founders say about the audit
      </p>
      <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-wide">
        Illustrative testimonials (mocked for launch)
      </p>
      <ul className="space-y-4">
        {TESTIMONIALS.map((t) => (
          <li
            key={t.author}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <blockquote className="text-sm text-gray-700 leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer className="mt-2 text-xs text-gray-500">
              — {t.author}, {t.context}
            </footer>
          </li>
        ))}
      </ul>
    </section>
  )
}
