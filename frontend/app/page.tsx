import VisualBuilder from '@/components/VisualBuilder'
import GlassNavbar from '@/components/GlassNavbar'
import HeroSection from '@/components/HeroSection'
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
    <main className="min-h-screen">
      <GlassNavbar auditHref="#audit-step-1" />
      <HeroSection />
      <VisualBuilder />

      <footer
        className="w-full border-t mt-4"
        style={{ borderColor: '#C8D9E6', backgroundColor: '#F5EFEB' }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
          <p className="text-center text-[11px]" style={{ color: '#567C8D' }}>
            Email is only requested after you view your results. · Credex © 2025
          </p>
        </div>
      </footer>
    </main>
  )
}
