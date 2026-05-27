import Link from 'next/link'

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

interface Props {
  /** CTA target — home uses #audit-step-1, other pages use /#audit-step-1 */
  auditHref?: string
}

export default function GlassNavbar({ auditHref = '#audit-step-1' }: Props) {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div
        className="w-full max-w-5xl mx-auto px-5 py-3 flex items-center justify-between rounded-2xl shadow-lg backdrop-blur-md border pointer-events-auto transition-all"
        style={{
          backgroundColor: 'rgba(245, 239, 235, 0.85)',
          borderColor: '#C8D9E6',
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-[13px] shadow-sm"
            style={{ backgroundColor: '#446577', color: '#ffffff' }}
          >
            C
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-[#1d2d3c]">
            Credex
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-[#C8D9E6]/50">
          <Link
            href="/"
            className="text-[13px] font-semibold text-[#5c6e7f] hover:text-[#1d2d3c] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/faq"
            className="text-[13px] font-semibold text-[#5c6e7f] hover:text-[#1d2d3c] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/faq"
            className="text-[13px] font-semibold text-[#5c6e7f] hover:text-[#1d2d3c] transition-colors"
          >
            About
          </Link>
        </div>

        <Link
          href={auditHref}
          className="hero-primary-btn px-5 py-2.5 rounded-xl text-[13px] shadow-md hover:scale-105 transition-transform"
        >
          Free Audit
          <ArrowIcon />
        </Link>
      </div>
    </nav>
  )
}
