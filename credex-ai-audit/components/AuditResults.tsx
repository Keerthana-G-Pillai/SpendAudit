'use client'

import { useState } from 'react'
import LeadCapture from './LeadCapture'
import ShareButton from './ShareButton'
import type { PublicAuditData, ToolRecommendation } from '@/lib/types'

interface Props {
  data: PublicAuditData
}

export default function AuditResults({ data }: Props) {
  const { auditResult, aiSummary, slug } = data
  const [leadCaptured, setLeadCaptured] = useState(false)

  const isHighSavings = auditResult.totalMonthlySavings > 500
  const isOptimal = auditResult.totalMonthlySavings === 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* Hero savings block */}
        <div className="text-center space-y-2">
          {isOptimal ? (
            <>
              <div className="text-4xl mb-2">✓</div>
              <h1 className="text-3xl font-bold text-gray-900">You are spending well</h1>
              <p className="text-gray-500">
                Your AI tool stack looks well-optimized for your team size and use case.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                Potential savings found
              </p>
              <h1 className="text-6xl font-bold text-gray-900">
                ${auditResult.totalMonthlySavings}
                <span className="text-2xl font-normal text-gray-400">/month</span>
              </h1>
              <p className="text-xl text-gray-500">
                ${auditResult.totalAnnualSavings.toLocaleString()} per year
              </p>
            </>
          )}
        </div>

        {/* Credex CTA — only for high savings */}
        {isHighSavings && (
          <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-3">
            <p className="font-semibold text-lg">Credex can save you even more</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Credex sells discounted AI credits at up to 40% off retail — sourced from
              companies that overforecast. With $500+/month in identified savings, you are exactly
              who we built this for.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-100 transition"
            >
              Book a free Credex consultation →
            </a>
          </div>
        )}

        {/* AI-generated summary */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            AI analysis
          </p>
          <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
        </div>

        {/* Per-tool breakdown */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Breakdown by tool</h2>
          {auditResult.recommendations.map((rec: ToolRecommendation, i: number) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl p-4 space-y-1.5"
            >
              <div className="flex justify-between items-start gap-4">
                <span className="font-medium text-gray-900 capitalize">
                  {rec.tool.replace(/-/g, ' ')}
                </span>
                {rec.estimatedMonthlySaving > 0 ? (
                  <span className="text-green-600 font-semibold text-sm whitespace-nowrap">
                    Save ${rec.estimatedMonthlySaving}/mo
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Optimal</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{rec.recommendedAction}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{rec.reasoning}</p>
            </div>
          ))}
        </div>

        {/* Share button */}
        <ShareButton slug={slug} />

        {/* Lead capture — always shown after results, never before */}
        {!leadCaptured ? (
          <LeadCapture
            slug={slug}
            auditId={slug}
            totalSavings={auditResult.totalMonthlySavings}
            onSuccess={() => setLeadCaptured(true)}
            isOptimal={isOptimal}
          />
        ) : (
          <p className="text-center text-sm text-gray-400 py-2">
            ✓ Audit sent to your inbox
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 pb-4">
          Powered by{' '}
          <a href="https://credex.rocks" className="hover:underline">
            Credex
          </a>
        </p>
      </div>
    </div>
  )
}
