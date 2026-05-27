'use client'

import { useState } from 'react'
import AnimatedCounter from './AnimatedCounter'
import CopyResultsButton from './CopyResultsButton'
import PdfExportButton from './PdfExportButton'
import ToolIcon from './ToolIcon'
import LeadCapture from './LeadCapture'
import ShareButton from './ShareButton'
import SocialProof from './SocialProof'
import LandingFAQ from './LandingFAQ'
import ReactMarkdown from 'react-markdown'
import type { PublicAuditData, ToolRecommendation } from '@/lib/types'

interface Props {
  data: PublicAuditData
}

export default function AuditResults({ data }: Props) {
  const { auditResult, aiSummary, slug, auditId } = data
  const [leadCaptured, setLeadCaptured] = useState(false)

  const isHighSavings = auditResult.totalMonthlySavings > 500
  const isOptimal = auditResult.totalMonthlySavings < 100

  return (
    <div className="min-h-screen hero-creme-vignette flex flex-col justify-between">
      <div>
        {/* ════════════════════════ FLOATING NAVBAR ════════════════════════ */}
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
              <span className="text-[17px] font-extrabold tracking-tight" style={{ color: '#2F4156' }}>
                Credex
              </span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-[#C8D9E6]/50">
              <a href="/" className="text-[13px] font-bold transition-colors" style={{ color: '#567C8D' }}>
                Features
              </a>
              <a href="/faq" className="text-[13px] font-bold transition-colors" style={{ color: '#567C8D' }}>
                FAQ
              </a>
              <a href="/faq" className="text-[13px] font-bold transition-colors" style={{ color: '#567C8D' }}>
                About
              </a>
            </div>

            {/* CTA */}
            <a
              href="/#audit-step-1"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-transform hover:scale-105 shadow-md"
              style={{ backgroundColor: '#567C8D', color: '#ffffff' }}
            >
              Free Audit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </nav>

        {/* ════════════════════════ MAIN CONTENT ════════════════════════ */}
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-12 space-y-5">
          
          {/* Page Header */}
          <header className="py-8 sm:py-10 border-l-[8px] pl-6 mb-6 flex flex-col justify-center" style={{ borderColor: '#2F4156' }}>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#2F4156' }}>
              AI Spend Audit Report
            </h1>
            <p className="mt-3 text-[14px] sm:text-[15px] font-medium max-w-3xl leading-relaxed" style={{ color: '#567C8D' }}>
              This page contains the customized audit results for your AI tools. Below you will find your potential monthly and annual savings, a personalized AI summary analysis, and a breakdown of optimization recommendations for each tool in your stack.
            </p>
          </header>

          {/* Summary Card */}
          <section className="ui-section p-6 sm:p-8 bg-gradient-to-br from-white to-[#C8D9E6]/20 border-2 border-[#2F4156] shadow-sm">
            <p className="ui-label mb-3" style={{ color: '#2F4156' }}>Summary</p>
            {isOptimal ? (
              <>
                <h1 className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: '#2F4156' }}>
                  You&apos;re spending well.
                </h1>
                <p className="ui-body mt-2">
                  Your current plan mix looks highly efficient for your team size and use case.
                  {auditResult.totalMonthlySavings > 0 && ` We found $${auditResult.totalMonthlySavings}/mo in potential minor optimizations, but you're already doing great.`}
                </p>
              </>
            ) : (
              <>
                <p className="text-[13px] font-bold mb-1" style={{ color: '#2F4156' }}>Potential monthly savings</p>
                <p className="text-[36px] sm:text-[40px] font-extrabold tracking-tight tabular-nums leading-none" style={{ color: '#2F4156' }}>
                  <AnimatedCounter
                    target={auditResult.totalMonthlySavings}
                    prefix="$"
                    duration={1200}
                  />
                </p>
                <p className="text-[14px] font-semibold mt-2 tabular-nums" style={{ color: '#2F4156' }}>
                  <AnimatedCounter
                    target={auditResult.totalAnnualSavings}
                    prefix="$"
                    suffix=" per year"
                    duration={1400}
                  />
                </p>
              </>
            )}
            
            {/* Benchmark Mode */}
            <div className="mt-5 pt-5 border-t border-[#C8D9E6]/60">
              <p className="text-[13px] font-bold" style={{ color: '#2F4156' }}>Benchmark comparison</p>
              <p className="text-[13px] font-medium leading-relaxed mt-1" style={{ color: '#567C8D' }}>
                Your AI spend per team member is <strong className="font-extrabold text-[#2F4156]">${Math.round(auditResult.totalCurrentSpend / data.teamSize)}</strong> — companies your size average <strong className="font-extrabold text-[#2F4156]">${auditResult.benchmarkAveragePerDev}</strong>.
              </p>
            </div>
            
            <p className="text-[11px] font-bold mt-6 pt-4 border-t border-[#C8D9E6]" style={{ color: 'rgba(86, 124, 141, 0.8)' }}>
              credex.rocks · shareable audit link
            </p>
          </section>

          {/* High Savings Banner */}
          {isHighSavings && (
            <section className="ui-section p-6 bg-gradient-to-br from-[#2F4156] to-[#1e2a38] border border-[#2F4156] shadow-md">
              <h2 className="text-[16px] font-bold text-white">Credex institutional credits</h2>
              <p className="text-[13px] mt-2 leading-relaxed" style={{ color: '#C8D9E6' }}>
                Savings exceed $500/mo. Credex offers discounted AI credits at up to 40% off retail.
              </p>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 h-9 items-center px-4 text-[13px] font-bold rounded-md bg-[#F5EFEB] text-[#2F4156] hover:bg-[#C8D9E6] hover:scale-105 transition-all shadow-sm"
              >
                Book consultation
              </a>
            </section>
          )}

          {/* AI Analysis Section */}
          <section className="ui-section p-5 sm:p-6 bg-gradient-to-br from-white to-[#C8D9E6]/20 border-2 border-[#2F4156] shadow-sm hover:border-[#2F4156]/80 transition-colors">
            <h2 className="ui-label mb-3" style={{ color: '#2F4156' }}>Analysis</h2>
            <div className="text-[14px] font-medium leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0 [&_strong]:font-extrabold [&_strong]:text-[#2F4156] [&_strong]:block [&_strong]:mt-5 [&_strong]:mb-1 [&_strong]:first:mt-0" style={{ color: '#2F4156' }}>
              <ReactMarkdown>{aiSummary}</ReactMarkdown>
            </div>
          </section>

          {/* Tool-by-Tool Recommendations */}
          <section>
            <h2 className="ui-heading mb-3 px-0.5" style={{ color: '#2F4156' }}>By tool</h2>
            <div className="flex flex-col gap-3">
              {auditResult.recommendations.map((rec: ToolRecommendation, i: number) => (
                <div 
                  key={`${rec.tool}-${i}`} 
                  className="bg-white border border-[#C8D9E6] rounded-xl p-4 sm:p-5 shadow-sm transition-all hover:translate-y-[-1px] hover:shadow-md hover:border-[#567C8D]/60 flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm bg-white flex items-center justify-center border border-[#C8D9E6]/30">
                        <ToolIcon tool={rec.tool} size="sm" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#2F4156] capitalize">
                          {rec.tool.replace(/-/g, ' ')}
                        </p>
                        <p className="text-[12px] text-[#567C8D] mt-0.5 font-medium">
                          Current spend{' '}
                          <span className="font-semibold text-[#2F4156]/90 tabular-nums">
                            ${rec.currentSpend}/mo
                          </span>
                        </p>
                      </div>
                    </div>
                    {rec.estimatedMonthlySaving > 0 ? (
                      <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 tabular-nums shrink-0">
                        −${rec.estimatedMonthlySaving}/mo
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#567C8D] bg-[#C8D9E6]/30 px-2.5 py-1 rounded-full border border-[#C8D9E6] uppercase tracking-wide shrink-0">
                        Optimal
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-gradient-to-r from-[#C8D9E6] to-transparent w-full" />
                  <div>
                    <p className="text-[13px] font-bold text-[#2F4156]">{rec.recommendedAction}</p>
                    {rec.estimatedMonthlySaving > 0 ? (
                      <details className="mt-2 group">
                        <summary className="text-[12px] font-bold text-[#567C8D] cursor-pointer hover:text-[#2F4156] select-none list-none flex items-center gap-1">
                          Why?
                          <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="text-[12px] text-[#567C8D] mt-1.5 leading-relaxed bg-[#f4f7f9] p-2.5 rounded-lg border border-[#C8D9E6]/50">
                          {rec.reasoning}
                        </p>
                      </details>
                    ) : (
                      <p className="text-[12px] text-[#567C8D] mt-1 leading-relaxed">{rec.reasoning}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ShareButton slug={slug} />
            <CopyResultsButton auditResult={auditResult} />
            <PdfExportButton auditResult={auditResult} aiSummary={aiSummary} />
          </div>

          {/* Referral Banner */}
          <section className="ui-section p-4 bg-gradient-to-r from-[#e8f0f6] to-[#F5EFEB] border border-[#C8D9E6] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold text-[#2F4156]">Share the tool, get rewarded</p>
              <p className="text-[12px] font-medium text-[#567C8D] mt-0.5">
                Share your unique referral link. Both parties get a Credex consultation & exclusive institutional credit perks!
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <ShareButton slug={slug} />
            </div>
          </section>

          {/* Lead Capture */}
          {!leadCaptured ? (
            <LeadCapture
              slug={slug}
              auditId={auditId}
              defaultTeamSize={data.teamSize}
              totalSavings={auditResult.totalMonthlySavings}
              onSuccess={() => setLeadCaptured(true)}
              isOptimal={isOptimal}
            />
          ) : (
            <p className="text-center text-[13px] font-bold py-2" style={{ color: '#2F4156' }} role="status">
              Audit sent to your inbox
            </p>
          )}
        </div>
      </div>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer
        className="w-full border-t mt-16"
        style={{ borderColor: '#C8D9E6' }}
      >
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-10">
          <p className="mt-10 text-center text-[11px]" style={{ color: '#567C8D' }}>
            Email is only requested after you view your results. · Credex © 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
