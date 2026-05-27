const FAQS = [
  {
    q: 'Is this actually free?',
    a: 'Yes. No credit card or account. We only ask for an optional email after you see results.',
  },
  {
    q: 'Do you connect to my tools or store my data?',
    a: 'No. You manually enter your tool stack. We do not connect to your APIs, we do not require account access, and we do not store your data beyond the shareable audit link.',
  },
  {
    q: 'How accurate are the estimates?',
    a: 'Every recommendation is backed by exact math using official vendor pricing. You can expand the "Why?" toggle on any recommendation to see the exact calculation behind it.',
  },
  {
    q: 'Why should I use this instead of doing a manual audit?',
    a: 'Manual audits often turn into hour-long meetings. This tool takes 2 minutes and generates a shareable link that gives you instant, defensible numbers to take to your team.',
  },
  {
    q: 'Which tools are covered?',
    a: 'Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf, Figma, and Notion.',
  },
]

export default function LandingFAQ() {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="ui-heading mb-4">
        Frequently asked questions
      </h2>
      <dl className="border border-accent rounded-md overflow-hidden divide-y divide-accent bg-white">
        {FAQS.map((item) => (
          <div key={item.q} className="p-4 sm:grid sm:grid-cols-[1fr_1.1fr] sm:gap-6">
            <dt className="text-[13px] font-medium text-primary">{item.q}</dt>
            <dd className="text-[13px] text-secondary leading-relaxed mt-1 sm:mt-0">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
