import SpendForm from '@/components/SpendForm'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon'
import { MorphingText } from '@/components/ui/morphing-text'
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
    <main className="min-h-screen bg-slate-50 relative">
      <HexagonBackground
        className="min-h-screen bg-slate-50 dark:bg-neutral-900"
        hexagonSize={55}
        hexagonMargin={3}
        hexagonProps={{
          className: "before:bg-slate-200/50 dark:before:bg-neutral-800/50 after:bg-slate-50 dark:after:bg-neutral-900 hover:before:bg-primary/20 hover:after:bg-slate-100",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <header className="text-center mb-10 sm:mb-12">
            <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
              Free tool by Credex
            </p>
            <div className="flex flex-col items-center mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-1 text-balance">
                Stop overpaying for
              </h1>
              <MorphingText
                texts={['Cursor', 'ChatGPT', 'Claude', 'Gemini', 'AI tools']}
                className="text-3xl sm:text-4xl h-12 text-primary font-extrabold"
              />
            </div>
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
      </HexagonBackground>
    </main>
  )
}
