import VisualBuilder from '@/components/VisualBuilder'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'

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
    <main className="min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-16 anim-1">
          <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-purple-100 rounded-full px-4 py-1.5 text-sm text-purple-700 font-medium shadow-sm mb-6">
            <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
            AI spend intelligence for startups
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Take Control of Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">AI Subscription Spend</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            Build your team's AI tool stack below. Adjust plan tiers and seats, then get a comprehensive, automated savings audit in less than 2 minutes.
          </p>
        </div>

        {/* The visual builder containing the three stacked steps */}
        <div className="anim-2">
          <VisualBuilder />
        </div>

        {/* Below-card extras */}
        <div className="mt-20 max-w-3xl mx-auto anim-3">
          <SocialProof />
          <LandingFAQ />
        </div>

      </div>
    </main>
  )
}
