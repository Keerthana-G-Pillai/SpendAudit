const FAQS = [
  {
    q: 'Is this actually free?',
    a: 'Yes. No credit card or account. We only ask for an optional email after you see your results.',
  },
  {
    q: 'Do you connect to my tools or store my data?',
    a: 'No. As one early stage founder told us, "if it threw technical terms or asked to connect to my data I would assume it steals my data." You manually enter your stack. We do not connect to your APIs, we do not require account access, and we do not store your data beyond the shareable audit link.',
  },
  {
    q: 'How accurate are the estimates?',
    a: 'Every recommendation is backed by exact math using official vendor pricing. We heard loud and clear from founders: "I would trust if the calculations are transparent and genuinely backed by data." You can expand the "Why?" toggle on any recommendation to see the exact calculation behind it.',
  },
  {
    q: 'Why should I use this instead of doing a manual audit?',
    a: 'Because manual audits often turn into hour-long meetings. As one engineering manager told us, they regularly audit their stack but it wastes an entire hour of meeting time. This tool takes 2 minutes and generates a shareable link that gives you instant, defensible numbers to take to your team.',
  },
  {
    q: 'My team keeps adding tools because of LinkedIn posts with rocket emojis. Can this help?',
    a: 'Yes! We frequently hear that subscriptions grow faster than headcount because of hype and "rocket emoji" posts. SpendAudit specifically identifies overlapping tools (like paying for both ChatGPT and Claude) so you can cut the redundancy without losing functionality.',
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
