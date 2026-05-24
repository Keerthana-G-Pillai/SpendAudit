import VisualBuilder from '@/components/VisualBuilder'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Spend Audit — Credex',
  description:
    'Audit your AI subscriptions. See where you are overspending and what to change.',
  openGraph: {
    title: 'AI Spend Audit — Credex',
    description: 'Audit your AI subscriptions in under two minutes.',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EFEB' }}>

      {/* ════════════════════════ NAVBAR ════════════════════════ */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div 
          className="w-full max-w-5xl mx-auto px-5 py-3 flex items-center justify-between rounded-2xl shadow-lg backdrop-blur-md border pointer-events-auto transition-all"
          style={{ backgroundColor: 'rgba(245, 239, 235, 0.85)', borderColor: '#C8D9E6' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-[13px] shadow-sm"
              style={{ backgroundColor: '#2F4156', color: '#ffffff' }}
            >
              C
            </div>
            <span className="text-[17px] font-extrabold tracking-tight" style={{ color: '#2F4156' }}>
              Credex
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-[#C8D9E6]/50">
            {['Features', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[13px] font-bold transition-colors"
                style={{ color: '#567C8D' }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-transform hover:scale-105 shadow-md"
            style={{ backgroundColor: '#567C8D', color: '#ffffff' }}
          >
            Free Audit
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </nav>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #2F4156 0%, #3d5470 45%, #567C8D 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#C8D9E6' }}
        />
        <div
          className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#C8D9E6' }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
          <div className="flex flex-col lg:flex-row lg:items-center gap-14">

            {/* ── Left copy ── */}
            <div className="flex-1 max-w-2xl">
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
                style={{ backgroundColor: 'rgba(200,217,230,0.15)', color: '#C8D9E6', border: '1px solid rgba(200,217,230,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#C8D9E6' }} />
                Free · No account required
              </div>

              <h1
                className="text-[38px] sm:text-[52px] font-extrabold leading-[1.1] tracking-tight mb-6"
                style={{ color: '#ffffff' }}
              >
                Stop overpaying
                <br />
                <span style={{ color: '#C8D9E6' }}>for AI tools.</span>
              </h1>

              <p
                className="text-[16px] sm:text-[17px] leading-relaxed mb-8 max-w-lg"
                style={{ color: 'rgba(200,217,230,0.85)' }}
              >
                Credex audits your team&apos;s AI subscriptions in under 2 minutes — 
                showing exactly where you&apos;re overspending and what to cut.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { value: '$480', label: 'avg. savings / mo' },
                  { value: '2 min', label: 'to complete' },
                  { value: '10+', label: 'tools analysed' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(200,217,230,0.12)', border: '1px solid rgba(200,217,230,0.2)' }}
                  >
                    <span className="text-[18px] font-extrabold tabular-nums" style={{ color: '#ffffff' }}>
                      {s.value}
                    </span>
                    <span className="text-[12px]" style={{ color: '#C8D9E6' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#audit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-lg"
                style={{ backgroundColor: '#F5EFEB', color: '#2F4156' }}
              >
                Audit my stack — it&apos;s free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* ── Right: floating card preview ── */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div
                className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
                style={{ backgroundColor: '#ffffff', border: '1px solid #C8D9E6' }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#567C8D' }}>Monthly spend</p>
                    <p className="text-[30px] font-extrabold tabular-nums leading-none mt-1" style={{ color: '#2F4156' }}>$1,240</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#567C8D' }}>Savings found</p>
                    <p className="text-[30px] font-extrabold tabular-nums leading-none mt-1" style={{ color: '#2F4156' }}>$380</p>
                  </div>
                </div>

                <div className="w-full h-px mb-5" style={{ backgroundColor: '#C8D9E6' }} />

                {/* Tool rows */}
                {[
                  { name: 'Cursor', plan: 'Business', cost: '$40/seat', flag: true },
                  { name: 'ChatGPT', plan: 'Team', cost: '$30/seat', flag: true },
                  { name: 'Copilot', plan: 'Individual', cost: '$10/seat', flag: false },
                  { name: 'Claude', plan: 'Pro', cost: '$20/seat', flag: false },
                ].map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: '#C8D9E6', color: '#2F4156' }}
                      >
                        {tool.name[0]}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold" style={{ color: '#2F4156' }}>{tool.name}</p>
                        <p className="text-[10px]" style={{ color: '#567C8D' }}>{tool.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] tabular-nums font-medium" style={{ color: '#2F4156' }}>{tool.cost}</span>
                      {tool.flag && (
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'rgba(86,124,141,0.15)', color: '#567C8D' }}
                        >
                          Overspend
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Progress bar */}
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid #C8D9E6' }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: '#567C8D' }}>Optimisation score</span>
                    <span className="text-[11px] font-bold" style={{ color: '#2F4156' }}>62%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#C8D9E6' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: '62%', backgroundColor: '#2F4156' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════ BUILDER ════════════════════════ */}
      <section id="audit" className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
        <div className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#567C8D' }}>
            Step-by-step audit
          </p>
          <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight" style={{ color: '#2F4156' }}>
            Build your AI stack
          </h2>
          <p className="mt-2 text-[15px] max-w-lg" style={{ color: '#567C8D' }}>
            Set your team size, choose a use case, and select the tools you pay for.
            We&apos;ll flag overspend and suggest smarter plans.
          </p>
        </div>

        <VisualBuilder />
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer
        className="w-full border-t"
        style={{ borderColor: '#C8D9E6', backgroundColor: '#F5EFEB' }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-14">
          <SocialProof />
          <div className="mt-12">
            <LandingFAQ />
          </div>
          <p className="mt-10 text-center text-[11px]" style={{ color: '#567C8D' }}>
            Email is only requested after you view your results. · Credex © 2025
          </p>
        </div>
      </footer>

    </main>
  )
}
