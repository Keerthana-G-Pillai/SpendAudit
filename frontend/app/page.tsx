import SpendForm from '@/components/SpendForm'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Spend Audit — Stop overpaying for AI tools',
  description:
    'Free 2-minute audit of your AI subscriptions. See exactly where you are overspending and what to do about it.',
  openGraph: {
    title: 'AI Spend Audit — Stop overpaying for AI tools',
    description: 'Free 2-minute audit of your AI subscriptions.',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <header className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Free tool by Credex
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4 text-balance">
            Stop overpaying for AI tools you barely use.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto text-pretty">
            Free 2-minute audit of your AI subscriptions. See exactly where you
            are overspending and what to do about it.
          </p>
        </header>

        <SpendForm />

        <p className="text-center text-sm text-gray-400 mt-6 sm:mt-8">
          No login required · Results in under 30 seconds · Email asked only after
          you see results
        </p>

        <SocialProof />
        <LandingFAQ />
      </div>
    </main>
  )
}
