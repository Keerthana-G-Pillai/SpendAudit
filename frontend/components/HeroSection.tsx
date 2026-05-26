import Link from 'next/link'
import FloatingHeroBadges from './FloatingHeroBadges'

const STATS = [
  { value: '$480', label: 'avg. savings / mo' },
  { value: '2 min', label: 'to complete' },
  { value: '10+', label: 'tools analysed' },
] as const

function ArrowIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.8}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  )
}

export default function HeroSection() {
  return (
    <div className="hero-creme-vignette text-[#1d2d3c] overflow-x-hidden min-h-screen relative">
      <FloatingHeroBadges />
      <main className="max-w-4xl mx-auto px-6 sm:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] pt-32 pb-12 relative z-10 text-center">
        <div className="space-y-8 flex flex-col items-center">
          <h1 className="text-5xl sm:text-[64px] font-black text-[#1d2d3c] tracking-tight leading-[1.08] max-w-3xl">
            Stop overpaying <br className="hidden sm:block" />
            for AI tools.
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#55697c] font-medium leading-relaxed max-w-[540px]">
            Credex audits your team&apos;s AI subscriptions in under 2 minutes – showing
            exactly where you&apos;re overspending and what to cut.
          </p>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[500px]">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#e4eff7]/70 backdrop-blur-sm p-4 rounded-xl border border-white/60 text-center shadow-sm"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-[#446577] tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-[12px] text-[#697d90] font-semibold mt-1 whitespace-nowrap">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="#audit-step-1"
              className="hero-primary-btn text-[15px] sm:text-[16px] py-4 px-8 rounded-full shadow-lg shadow-slate-400/20"
            >
              Audit my stack – it&apos;s free
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
