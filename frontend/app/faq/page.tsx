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
        {/* ════════════════════════ NAVBAR ════════════════════════ */}
        <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
          <div 
            className="w-full max-w-5xl mx-auto px-5 py-3 flex items-center justify-between rounded-2xl shadow-lg backdrop-blur-md border pointer-events-auto transition-all"
            style={{ backgroundColor: 'rgba(245, 239, 235, 0.85)', borderColor: '#C8D9E6' }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-[13px] shadow-sm"
                style={{ backgroundColor: '#2F4156', color: '#ffffff' }}
              >
                C
              </div>
              <a href="/" className="text-[17px] font-extrabold tracking-tight" style={{ color: '#2F4156' }}>
                Credex
              </a>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-[#C8D9E6]/50">
              <a href="/" className="text-[13px] font-bold transition-colors" style={{ color: '#567C8D' }}>
                Features
              </a>
              <a href="/faq" className="text-[13px] font-bold transition-colors" style={{ color: '#2F4156' }}>
                FAQ
              </a>
              <a href="/faq" className="text-[13px] font-bold transition-colors" style={{ color: '#2F4156' }}>
                About
              </a>
            </div>

            {/* CTA */}
            <a
              href="/#audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-transform hover:scale-105 shadow-md"
              style={{ backgroundColor: '#567C8D', color: '#ffffff' }}
            >
              Free Audit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </nav>

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
