import SpendForm from '@/components/SpendForm'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import type { Metadata } from 'next'
import { CheckCircle, Lock, Clock, ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Spend Audit — Stop overpaying for AI tools',
  description:
    'Free 2-minute audit of your AI subscriptions. See exactly where you are overspending and what to do about it.',
  openGraph: {
    title: 'AI Spend Audit — Stop overpaying for AI tools',
    description: 'Free 2-minute audit of your AI subscriptions.',
  },
}

const STATS = [
  { value: '$340', label: 'AVG OVERSPEND FOUND' },
  { value: '8', label: 'TOOLS COVERED' },
  { value: '2 min', label: 'AVG AUDIT TIME', green: true },
]

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f0ede8' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Badge */}
        <div className="fade-in-up fade-in-up-delay-1 mb-6">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium shadow-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            AI spend intelligence for startups
          </span>
        </div>

        {/* Hero headline */}
        <header className="mb-8 fade-in-up fade-in-up-delay-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your AI stack is<br />
            costing you{' '}
            <span style={{ color: '#1a7a3c' }}>more</span>
            <br />
            than it should.
          </h1>
          <p className="text-base text-gray-600 max-w-md leading-relaxed">
            Enter your subscriptions. Get an instant audit — where you are
            overpaying, what to cut, and the exact dollar amount you recover.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              No account needed
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Results in 30 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <ChevronDown className="w-3.5 h-3.5" />
              Email only after you see results
            </span>
          </div>
        </header>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6 fade-in-up fade-in-up-delay-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm"
            >
              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: stat.green ? '#1a7a3c' : '#111' }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 fade-in-up fade-in-up-delay-4">
          <SpendForm />
        </div>

        <SocialProof />
        <LandingFAQ />
      </div>
    </main>
  )
}
