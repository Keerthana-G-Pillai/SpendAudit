'use client'

import { useState } from 'react'
import LeadCapture from './LeadCapture'
import ShareButton from './ShareButton'
import type { PublicAuditData, ToolRecommendation } from '@backend/lib/types'

interface Props {
  data: PublicAuditData
}

export default function AuditResults({ data }: Props) {
  const { auditResult, aiSummary, slug, auditId } = data
  const [leadCaptured, setLeadCaptured] = useState(false)

  const isHighSavings = auditResult.totalMonthlySavings > 500
  const isOptimal = auditResult.totalMonthlySavings === 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">

        <header className="text-center space-y-2">
          {isOptimal ? (
            <>
              <p className="text-3xl sm:text-4xl mb-2" aria-hidden="true">
                ✓
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                You are spending well
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Your AI tool stack looks well-optimized for your team size and use case.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                Potential savings found
              </p>
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tabular-nums">
                ${auditResult.totalMonthlySavings}
                <span className="text-xl sm:text-2xl font-normal text-gray-400">/month</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500">
                ${auditResult.totalAnnualSavings.toLocaleString()} per year
              </p>
            </>
          )}
        </header>

        {isHighSavings && (
          <section
            className="bg-gray-900 text-white rounded-2xl p-5 sm:p-6 space-y-3"
            aria-labelledby="credex-cta"
          >
            <h2 id="credex-cta" className="font-semibold text-lg">
              Credex can save you even more
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Credex sells discounted AI credits at up to 40% off retail — sourced from
              companies that overforecast. With $500+/month in identified savings, you are
              exactly who we built this for.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center bg-white text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Book a free Credex consultation →
            </a>
          </section>
        )}

        <section className="bg-gray-50 rounded-xl p-4 sm:p-5" aria-labelledby="ai-summary">
          <h2 id="ai-summary" className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            AI analysis
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{aiSummary}</p>
        </section>

        <section aria-labelledby="breakdown-heading">
          <h2 id="breakdown-heading" className="font-semibold text-gray-900 mb-3">
            Breakdown by tool
          </h2>
          <ul className="space-y-3">
            {auditResult.recommendations.map((rec: ToolRecommendation, i: number) => (
              <li
                key={`${rec.tool}-${i}`}
                className="border border-gray-100 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                  <span className="font-medium text-gray-900 capitalize">
                    {rec.tool.replace(/-/g, ' ')}
                  </span>
                  {rec.estimatedMonthlySaving > 0 ? (
                    <span className="text-green-600 font-semibold text-sm">
                      Save ${rec.estimatedMonthlySaving}/mo
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Optimal</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{rec.recommendedAction}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.reasoning}</p>
              </li>
            ))}
          </ul>
        </section>

        <ShareButton slug={slug} />

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
          <p className="text-center text-sm text-gray-500 py-2" role="status">
            Audit sent to your inbox
          </p>
        )}

        <footer className="text-center text-xs text-gray-400 pb-4">
          Powered by{' '}
          <a
            href="https://credex.rocks"
            className="underline hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 rounded"
          >
            Credex
          </a>
        </footer>
      </div>
    </div>
  )
}
