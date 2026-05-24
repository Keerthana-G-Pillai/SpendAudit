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
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-zinc-900 tracking-[-0.02em]">
            Credex
          </span>
          <span className="text-[11px] text-zinc-500">AI spend audit</span>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <header className="mb-10">
          <h1 className="text-[24px] sm:text-[26px] font-semibold text-zinc-900 tracking-[-0.025em] leading-[1.2]">
            Audit your AI tool spend
          </h1>
          <p className="mt-2 text-[14px] text-zinc-500 leading-relaxed max-w-[460px]">
            Configure your team and stack below. You will get a savings breakdown in
            under two minutes — no account required.
          </p>
        </header>

        <VisualBuilder />

        <footer className="mt-16 pt-10 border-t border-zinc-200">
          <SocialProof />
          <div className="mt-12">
            <LandingFAQ />
          </div>
          <p className="mt-10 text-center text-[11px] text-zinc-400">
            Email is only requested after you view your results.
          </p>
        </footer>
      </div>
    </main>
  )
}
