const FAQS = [
  {
    q: 'Is this actually free?',
    a: 'Yes. No credit card or account. We only ask for an optional email after you see results.',
  },
  {
    q: 'How accurate are the estimates?',
    a: 'Pricing is sourced from official vendor pages. Recommendations use published plan features and your team size.',
  },
  {
    q: 'Do you store my data?',
    a: 'Audits are saved for sharing via a unique link. Email is only used to send your summary.',
  },
  {
    q: 'What is Credex?',
    a: 'Credex sells discounted AI credits. We mention it only when savings are significant.',
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
      <dl className="border border-zinc-200 rounded-md overflow-hidden divide-y divide-zinc-200 bg-white">
        {FAQS.map((item) => (
          <div key={item.q} className="p-4 sm:grid sm:grid-cols-[1fr_1.1fr] sm:gap-6">
            <dt className="text-[13px] font-medium text-zinc-900">{item.q}</dt>
            <dd className="text-[13px] text-zinc-500 leading-relaxed mt-1 sm:mt-0">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
