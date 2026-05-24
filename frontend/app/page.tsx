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
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6 anim-1">
          <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-purple-100 rounded-full px-4 py-1.5 text-sm text-purple-700 font-medium shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
            AI spend intelligence for startups
          </span>
        </div>

        {/* Main wide card */}
        <div
          className="anim-2 rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.95)',
          }}
        >
          {/* Title bar */}
          <div className="px-8 pt-6 pb-4 text-center border-b border-purple-50">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Visual AI Stack Builder
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select your tools, set team size, and get an instant spend audit.
            </p>
          </div>

          {/* Single unified component — handles its own two-column layout */}
          <VisualBuilder />
        </div>

        {/* Below-card extras */}
        <div className="mt-10 max-w-3xl mx-auto">
          <SocialProof />
          <LandingFAQ />
        </div>

      </div>
    </main>
  )
}
