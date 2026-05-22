const FAQS = [
  {
    q: 'Is this actually free? What is the catch?',
    a: 'Yes, completely free. No credit card, no account required. The audit runs instantly. We only ask for an optional email after you see your results.',
  },
  {
    q: 'How accurate are the savings estimates?',
    a: 'Pricing data is verified from official vendor pages. Recommendations use published plan features and your team size — not guesses.',
  },
  {
    q: 'Do you store my data?',
    a: 'Your audit is saved so you can share it via a unique link. We never store payment info. Email is only used to send your summary.',
  },
  {
    q: 'What is Credex and why is it in my audit?',
    a: 'Credex sells discounted AI credits from companies that overforecast. We mention it only when your savings are significant — not for everyone.',
  },
  {
    q: 'What AI tools do you cover?',
    a: 'Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.',
  },
]

export default function LandingFAQ() {
  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-lg font-semibold text-gray-900 mb-4">
        Frequently asked questions
      </h2>
      <dl className="space-y-4">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-gray-100 pb-4 last:border-0">
            <dt className="font-medium text-gray-900 text-sm">{item.q}</dt>
            <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
