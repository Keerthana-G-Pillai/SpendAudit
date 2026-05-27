import GlassNavbar from '@/components/GlassNavbar'
import LandingFAQ from '@/components/LandingFAQ'
import SocialProof from '@/components/SocialProof'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ & Testimonials — Credex',
  description: 'Frequently asked questions and testimonials for AI Spend Audit by Credex.',
}

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between" style={{ backgroundColor: '#F5EFEB' }}>
      <div>
        <GlassNavbar auditHref="/#audit-step-1" />

        {/* ════════════════════════ CONTENT ════════════════════════ */}
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 pt-28 pb-12 space-y-12">
          <div className="text-center">
            <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight" style={{ color: '#2F4156' }}>
              FAQ & Testimonials
            </h1>
            <p className="mt-2 text-[15px]" style={{ color: '#567C8D' }}>
              Learn more about how we audit your AI subscriptions and save you money.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8D9E6] rounded-2xl shadow-sm">
            <SocialProof />
          </div>

          <div className="p-6 bg-white border border-[#C8D9E6] rounded-2xl shadow-sm">
            <LandingFAQ />
          </div>
        </div>
      </div>

      {/* ════════════════════════ SIMPLIFIED FOOTER ════════════════════════ */}
      <footer
        className="w-full border-t"
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
