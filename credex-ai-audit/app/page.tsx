import SpendForm from '@/components/SpendForm'
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
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Free tool by Credex
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Stop overpaying for AI tools.
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Enter your AI subscriptions and get an instant audit — where you are overspending,
            what to switch, and how much you save.
          </p>
        </div>

        {/* Form */}
        <SpendForm />

        {/* Trust signals */}
        <p className="text-center text-sm text-gray-400 mt-8">
          No login required · Results in under 30 seconds · Email asked only after you see results
        </p>
      </div>
    </main>
  )
}
