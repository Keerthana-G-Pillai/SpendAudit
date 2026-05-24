'use client'

import { useState } from 'react'
import AnimatedCounter from './AnimatedCounter'
import CopyResultsButton from './CopyResultsButton'
import PdfExportButton from './PdfExportButton'
import ToolIcon from './ToolIcon'
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-zinc-900 tracking-[-0.02em]">
            Credex
          </span>
          <span className="text-[11px] text-zinc-500">Audit results</span>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-10 sm:py-12 space-y-4">
        <section className="ui-section p-6 sm:p-8">
          <p className="ui-label mb-3">Summary</p>
          {isOptimal ? (
            <>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-[-0.02em]">
                Stack within expected range
              </h1>
              <p className="ui-body mt-2">
                Your current plan mix looks appropriate for your team size and use case.
              </p>
            </>
          ) : (
            <>
              <p className="text-[13px] text-zinc-500 mb-1">Potential monthly savings</p>
              <p className="text-[36px] sm:text-[40px] font-semibold text-zinc-900 tracking-[-0.03em] tabular-nums leading-none">
                <AnimatedCounter
                  target={auditResult.totalMonthlySavings}
                  prefix="$"
                  duration={1200}
                />
              </p>
              <p className="text-[14px] text-zinc-500 mt-2 tabular-nums">
                <AnimatedCounter
                  target={auditResult.totalAnnualSavings}
                  prefix="$"
                  suffix=" per year"
                  duration={1400}
                />
              </p>
            </>
          )}
          <p className="text-[11px] text-zinc-400 mt-6 pt-4 border-t border-zinc-100">
            credex.rocks · shareable audit link
          </p>
        </section>

        {isHighSavings && (
          <section className="ui-section p-5 border-zinc-900 bg-zinc-900 text-white">
            <h2 className="text-[15px] font-semibold">Credex institutional credits</h2>
            <p className="text-[13px] text-zinc-300 mt-1.5 leading-relaxed">
              Savings exceed $500/mo. Credex offers discounted AI credits at up to 40% off
              retail.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-4 h-9 items-center px-4 text-[13px] font-medium bg-white text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Book consultation
            </a>
          </section>
        )}

        <section className="ui-section p-5 sm:p-6">
          <h2 className="ui-label mb-3">Analysis</h2>
          <p className="text-[14px] text-zinc-700 leading-relaxed">{aiSummary}</p>
        </section>

        <section>
          <h2 className="ui-heading mb-3 px-0.5">By tool</h2>
          <ul className="border border-zinc-200 rounded-md overflow-hidden divide-y divide-zinc-200 bg-white">
            {auditResult.recommendations.map((rec: ToolRecommendation, i: number) => (
              <li key={`${rec.tool}-${i}`} className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <ToolIcon tool={rec.tool} />
                    <div>
                      <p className="text-[14px] font-medium text-zinc-900 capitalize">
                        {rec.tool.replace(/-/g, ' ')}
                      </p>
                      <p className="text-[13px] text-zinc-500 mt-0.5">
                        Current spend{' '}
                        <span className="font-medium text-zinc-700 tabular-nums">
                          ${rec.currentSpend}/mo
                        </span>
                      </p>
                    </div>
                  </div>
                  {rec.estimatedMonthlySaving > 0 ? (
                    <span className="text-[13px] font-medium text-emerald-700 tabular-nums shrink-0">
                      −${rec.estimatedMonthlySaving}/mo
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide shrink-0">
                      Optimal
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-medium text-zinc-800 mt-3">{rec.recommendedAction}</p>
                <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed">{rec.reasoning}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-2">
          <ShareButton slug={slug} />
          <CopyResultsButton auditResult={auditResult} />
          <PdfExportButton auditResult={auditResult} aiSummary={aiSummary} />
        </div>

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
          <p className="text-center text-[13px] text-zinc-500 py-2" role="status">
            Audit sent to your inbox
          </p>
        )}
      </div>
    </div>
  )
}
