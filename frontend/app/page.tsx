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
    <main className="min-h-screen bg-background">
      {/* ── Nav bar: Sky Blue surface for breathing room ── */}
      <nav className="border-b border-[#C8D9E6] bg-[#C8D9E6]/40">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-3.5 flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#2F4156] tracking-tight">
            Credex
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#567C8D]">
            AI Spend Audit
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 pt-12 sm:pt-16 pb-10">
        <header className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#567C8D] mb-3">
            Free · No account required
          </p>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#2F4156] tracking-tight leading-[1.15] max-w-2xl">
            Audit your AI tool spend
          </h1>
          <p className="mt-3 text-[15px] text-[#567C8D] leading-relaxed max-w-xl">
            Configure your team and stack below. You&apos;ll get a savings
            breakdown in under two minutes.
          </p>
        </header>

        <VisualBuilder />

        <footer className="mt-16 pt-10 border-t border-[#C8D9E6]">
          <SocialProof />
          <div className="mt-12">
            <LandingFAQ />
          </div>
          <p className="mt-10 text-center text-[11px] text-[#567C8D]/70">
            Email is only requested after you view your results.
          </p>
        </footer>
      </div>
    </main>
  )
}
