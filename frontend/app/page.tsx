import SpendForm from '@/components/SpendForm'
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
    <main className="min-h-screen py-10 sm:py-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-5 anim-1">
          <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-purple-100 rounded-full px-4 py-1.5 text-sm text-purple-700 font-medium shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
            AI spend intelligence for startups
          </span>
        </div>

        {/* Main card */}
        <div
          className="anim-2 rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)' }}
        >
          {/* Card header */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-purple-50">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Visual AI Stack Builder
            </h1>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            <SpendForm />
          </div>
        </div>

        {/* Below-card extras */}
        <div className="mt-8">
          <SocialProof />
          <LandingFAQ />
        </div>

      </div>
    </main>
  )
}
