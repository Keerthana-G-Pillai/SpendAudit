'use client'

import { useState } from 'react'
import AnimatedCounter from './AnimatedCounter'
import CopyResultsButton from './CopyResultsButton'
import PdfExportButton from './PdfExportButton'
import ToolIcon from './ToolIcon'
import LeadCapture from './LeadCapture'
import ShareButton from './ShareButton'
import { FlickeringGrid } from '@/components/ui/flickering-grid'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">

        {/* ── Screenshot-friendly hero section with Credex watermark ── */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle Flickering Grid overlay */}
          <div className="absolute inset-0 -z-10 opacity-[0.08] pointer-events-none">
            <FlickeringGrid
              squareSize={4}
              gridGap={5}
              flickerChance={0.2}
              color="rgb(59, 130, 246)"
              maxOpacity={0.3}
            />
          </div>

          {/* Subtle Credex watermark */}
          <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 select-none" aria-hidden="true">
            credex.rocks
          </span>

          <header className="text-center space-y-2">
            {isOptimal ? (
              <>
                <p className="text-3xl sm:text-4xl mb-2" aria-hidden="true">
                  ✓
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold">You are spending well</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Your AI tool stack looks well-optimized for your team size and use case.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Potential savings found
                </p>
                <h1 className="text-4xl sm:text-6xl font-bold tabular-nums">
                  <AnimatedCounter
                    target={auditResult.totalMonthlySavings}
                    prefix="$"
                    duration={1500}
                  />
                  <span className="text-xl sm:text-2xl font-normal text-muted-foreground">/month</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  <AnimatedCounter
                    target={auditResult.totalAnnualSavings}
                    prefix="$"
                    suffix=" per year"
                    duration={1800}
                  />
                </p>
              </>
            )}
          </header>

          {/* Bottom branding bar for screenshot sharing */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>AI Spend Audit</span>
            <span className="font-medium">Powered by Credex</span>
          </div>
        </div>

        {isHighSavings && (
          <Card className="bg-primary text-primary-foreground ring-primary">
            <CardHeader>
              <CardTitle className="text-primary-foreground">
                Credex can save you even more
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Credex sells discounted AI credits at up to 40% off retail. With $500+/month
                in identified savings, you are exactly who we built this for.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                Book a free Credex consultation →
              </a>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              AI analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-sm sm:text-base">{aiSummary}</p>
          </CardContent>
        </Card>

        <section aria-labelledby="breakdown-heading">
          <h2 id="breakdown-heading" className="font-semibold mb-3">
            Breakdown by tool
          </h2>
          <ul className="space-y-3">
            {auditResult.recommendations.map((rec: ToolRecommendation, i: number) => (
              <li key={`${rec.tool}-${i}`}>
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex items-start gap-3">
                        <ToolIcon tool={rec.tool} />
                        <div>
                          <CardTitle className="capitalize text-base">
                            {rec.tool.replace(/-/g, ' ')}
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-foreground mt-1">
                            Current spend: ${rec.currentSpend}/mo
                          </CardDescription>
                        </div>
                      </div>
                      {rec.estimatedMonthlySaving > 0 ? (
                        <span className="text-green-600 font-semibold text-sm shrink-0">
                          Save ${rec.estimatedMonthlySaving}/mo
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm shrink-0">Optimal</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1.5">
                    <p className="text-sm font-medium">{rec.recommendedAction}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rec.reasoning}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/* Action buttons */}
        <div className="space-y-3">
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
          <p className="text-center text-sm text-muted-foreground py-2" role="status">
            Audit sent to your inbox
          </p>
        )}

        <footer className="text-center text-xs text-muted-foreground pb-4">
          Powered by{' '}
          <a href="https://credex.rocks" className="underline hover:text-foreground">
            Credex
          </a>
        </footer>
      </div>
    </div>
  )
}
